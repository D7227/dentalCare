// QA Controller: uses helpers/authHelpers for password/email validation and hashing
import { db } from "server/database/db";
import { eq, sql, and, inArray } from "drizzle-orm";
import { qaDailyReportSchema, qaUserSchema } from "./qaSchema";
import { orderSchema } from "../order/orderSchema";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RolesStorage } from "../role/roleController";
import {
  hashPassword,
  comparePassword,
  isStrongPassword,
  isValidEmail,
} from "../helpers/authHelpers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Set a static QA roleId for now (replace with your actual QA role UUID)
const STATIC_QA_ROLE_ID = "00000000-0000-0000-0000-000000000qa1";

export const qaController = {
  // --- QA Auth & Management ---
  // Register a new QA
  async registerQa(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const qaRoleName = 'entry_qa';
      console.log("email",email)
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields (email, password, name)" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      if (!isStrongPassword(password)) {
        return res.status(400).json({ error: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character" });
      }
      // Check for existing email
      const existing = await db
        .select()
        .from(qaUserSchema)
        .where(eq(qaUserSchema.email, email));
      if (existing.length > 0)
        return res.status(409).json({ error: "Email already registered" });
      const roleData = await RolesStorage.getRoleByName(qaRoleName);
      const roleId = roleData?.id;
      const passwordHash = await hashPassword(password);

      const qaData = {
        email,
        passwordHash,
        name,
        roleId,
      }
      const [user] = await db
        .insert(qaUserSchema)
        .values(qaData as any)
        .returning();
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to register QA" });
    }
  },

  // Login QA
  async loginQa(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });
      const [user] = await db
        .select()
        .from(qaUserSchema)
        .where(eq(qaUserSchema.email, email));
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        token,
        user: { id: user.id, email: user.email, fullName: user.name, roleId: user.roleId, roleName: 'entry_qa'},
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to login QA" });
    }
  },

  // Dummy logout (for stateless JWT, just clear token on client)
  async logoutQa(_req: Request, res: Response) {
    res.status(200).json({ message: "Logged out (client should clear token)" });
  },

  // Delete QA
  async deleteQa(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "Missing QA id" });
      const [deleted] = await db
        .delete(qaUserSchema)
        .where(eq(qaUserSchema.id, id))
        .returning();
      if (!deleted) return res.status(404).json({ error: "QA not found" });
      res.status(200).json({ message: "QA deleted", id });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete QA" });
    }
  },

  // Submit a new daily report
  async submitDailyReport(req: Request, res: Response) {
    try {
      const { qaId, reportDate, approvedOrderIds, rejectedOrderIds, rescanOrderIds,modifiedOrderIds, ...rest } = req.body;
      if (!qaId || !reportDate) {
        return res.status(400).json({ error: "qaId and reportDate are required" });
      }

      // Ensure reportDate is a string in 'YYYY-MM-DD' format
      const dateStr = typeof reportDate === 'string'
        ? reportDate.slice(0, 10)
        : new Date(reportDate).toISOString().slice(0, 10);

      const [existing] = await db
        .select()
        .from(qaDailyReportSchema)
        .where(
          and(
            eq(qaDailyReportSchema.qaId, qaId),
            eq(qaDailyReportSchema.reportDate, dateStr)
          )
        );

      // Helper to merge arrays and avoid duplicates
      const mergeIds = (oldArr: any, newArr: any) => {
        if (!Array.isArray(oldArr)) oldArr = [];
        if (!Array.isArray(newArr)) newArr = [];
        return Array.from(new Set([...(oldArr || []), ...(newArr || [])]));
      };

      if (existing) {
        // Update the existing report
        const updatedFields: any = {};
        if (approvedOrderIds) {
          updatedFields.approvedOrderIds = mergeIds(existing.approvedOrderIds, approvedOrderIds);
        }
        if (rejectedOrderIds) {
          updatedFields.rejectedOrderIds = mergeIds(existing.rejectedOrderIds, rejectedOrderIds);
        }
        if (rescanOrderIds) {
          updatedFields.rescanOrderIds = mergeIds(existing.rescanOrderIds, rescanOrderIds);
        }if (modifiedOrderIds) {
          updatedFields.modifiedOrderIds = mergeIds(existing.modifiedOrderIds, modifiedOrderIds);
        }
        // Add any other fields you want to update (e.g., summary, notes)
        Object.assign(updatedFields, rest);

        const [updated] = await db
          .update(qaDailyReportSchema)
          .set({
            ...updatedFields,
            updatedAt: new Date(),
          })
          .where(eq(qaDailyReportSchema.id, existing.id))
          .returning();
        return res.status(200).json(updated);
      } else {
        // Create a new report
        const [created] = await db
          .insert(qaDailyReportSchema)
          .values({
            qaId,
            reportDate: dateStr,
            approvedOrderIds: approvedOrderIds || [],
            rejectedOrderIds: rejectedOrderIds || [],
            rescanOrderIds: rescanOrderIds || [],
            modifiedOrderIds: modifiedOrderIds || [],
            ...rest,
          })
          .returning();
        return res.status(201).json(created);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to submit daily report" });
    }
  },

  // Get all daily reports for a particular QA (with pagination)
  async getAllDailyReports(req: Request, res: Response) {
    try {
      const { qaId, page = 1, pageSize = 20, withOrderDetails } = req.query;
      const offset = (Number(page) - 1) * Number(pageSize);
      const where = qaId
        ? eq(qaDailyReportSchema.qaId, qaId as string)
        : undefined;
      const query = db
        .select()
        .from(qaDailyReportSchema)
        .where(where)
        .offset(offset)
        .limit(Number(pageSize));
      const reports = await query;
      const total = await db
        .select({ count: sql`count(*)` })
        .from(qaDailyReportSchema)
        .where(where);

      // If withOrderDetails=true, join with order table for each order ID array
      if (withOrderDetails === "true") {
        for (const report of reports) {
          // Helper to fetch order details for an array of order IDs
          const fetchOrders = async (ids: unknown) => {
            const arr = Array.isArray(ids) ? ids : [];
            return db
              .select()
              .from(orderSchema)
              .where(inArray(orderSchema.id, arr as string[]));
          };
          // Add extra fields dynamically (safe for API response)
          (report as any).approvedOrderDetails = await fetchOrders(
            report.approvedOrderIds
          );
          (report as any).rejectedOrderDetails = await fetchOrders(
            report.rejectedOrderIds
          );
          (report as any).rescanOrderDetails = await fetchOrders(
            report.rescanOrderIds
          );
          (report as any).placeOrderDetails = await fetchOrders(
            report.placeOrderIds
          );
          (report as any).accessoriesPendingOrderDetails = await fetchOrders(
            report.accessoriesPendingOrderIds
          );
        }
      }
      res.status(200).json({ data: reports, total: total[0]?.count || 0 });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch daily reports" });
    }
  },

  // Get today's daily report(s) for a particular QA
  async getTodaysDailyReport(req: Request, res: Response) {
    try {
      const { qaId } = req.query;
      if (!qaId) return res.status(400).json({ error: "qaId is required" });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const reports = await db
        .select()
        .from(qaDailyReportSchema)
        .where(
          and(
            eq(qaDailyReportSchema.qaId, qaId as string),
            sql`${
              qaDailyReportSchema.createdAt
            } >= ${today.toISOString()} AND ${
              qaDailyReportSchema.createdAt
            } < ${tomorrow.toISOString()}`
          )
        );
      res.status(200).json(reports);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to fetch today's daily report",
      });
    }
  },

  // Get daily reports by filter (monthly, yearly, or custom date range, with pagination)
async getFilteredDailyReports(req: Request, res: Response) {
  try {
    const {
      qaId,
      month,
      year,
      startDate,
      endDate,
      page = 1,
      pageSize = 20,
    } = req.body;

    const offset = (Number(page) - 1) * Number(pageSize);

    const conditions: (ReturnType<typeof sql> | ReturnType<typeof eq>)[] = [];

    if (qaId) {
      conditions.push(eq(qaDailyReportSchema.qaId, qaId));
    }

    if (month && year) {
      conditions.push(
        sql`EXTRACT(MONTH FROM ${qaDailyReportSchema.reportDate}) = ${Number(
          month
        )}`
      );
      conditions.push(
        sql`EXTRACT(YEAR FROM ${qaDailyReportSchema.reportDate}) = ${Number(
          year
        )}`
      );
    } else if (startDate && endDate) {
      conditions.push(
        sql`${qaDailyReportSchema.reportDate} BETWEEN ${startDate} AND ${endDate}`
      );
    } else if (year) {
      conditions.push(
        sql`EXTRACT(YEAR FROM ${qaDailyReportSchema.reportDate}) = ${Number(
          year
        )}`
      );
    }

    const whereClause =
      conditions.length > 1 ? sql`${sql.join(conditions, sql` AND `)}` : conditions[0];

    const reports = await db
      .select()
      .from(qaDailyReportSchema)
      .where(whereClause)
      .offset(offset)
      .limit(Number(pageSize));

    const total = await db
      .select({ count: sql`count(*)` })
      .from(qaDailyReportSchema)
      .where(whereClause);

    res.status(200).json({ data: reports, total: total[0]?.count || 0 });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to fetch filtered daily reports",
    });
  }
}

};
