import { db } from "server/database/db";
import {
  departmentHeadSchema,
  departmentSchema,
  labOrderSchema,
  orderFlowSchema,
} from "./departmentHeadSchema";
import { and, eq, isNull, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { orderSchema } from "../order/orderSchema";
import { clinic } from "../clinic/clinicSchema";
import { patients } from "../patient/patientSchema";
import { clinicInformation } from "../clinicInformation/clinicInformationSchema";
import { technicianUser } from "../technician/technicianSchema";

const JWT_SECRET = process.env.JWT_SECRET;

// Utility: Always treat departmentIds as an array (handles both single and multiple IDs)
function normalizeToArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim() !== "") return [value];
  return [];
}

// Helper function to get department names for better error messages
async function getDepartmentNames(departmentIds: string[]): Promise<string[]> {
  if (!departmentIds || departmentIds.length === 0) return [];

  // For now, we'll just return the IDs since we need to implement proper IN clause
  // TODO: Implement proper IN clause for multiple department IDs
  return departmentIds;
}

export const departmentHeadController = {
  // Create Department Head (admin/seed)
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, roleId } = req.body;
      let departmentIds = normalizeToArray(req.body.departmentIds);

      // Validate required fields
      if (!name || !email || !password || !roleId || !departmentIds.length) {
        return res.status(400).json({
          error:
            "Missing required fields: name, email, password, roleId, and at least one departmentId are required",
        });
      }

      // Check if email already exists
      const existingUser = await db
        .select()
        .from(departmentHeadSchema)
        .where(eq(departmentHeadSchema.email, email));

      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Check if departments are already assigned to other heads
      if (departmentIds.length > 0) {
        const allDepartmentHeads = await db.select().from(departmentHeadSchema);

        for (const deptId of departmentIds) {
          for (const existingHead of allDepartmentHeads) {
            const headDepts = normalizeToArray(existingHead.departmentIds);
            if (headDepts.includes(deptId)) {
              return res.status(409).json({
                error: `Department with ID ${deptId} is already assigned to department head: ${existingHead.name}`,
              });
            }
          }
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create department head
      const [created] = await db
        .insert(departmentHeadSchema)
        .values({
          name,
          email,
          password: hashedPassword,
          roleId,
          departmentIds,
        })
        .returning();

      res.status(201).json({
        message: "Department head created successfully",
        user: {
          id: created.id,
          name: created.name,
          email: created.email,
          roleId: created.roleId,
          departmentIds: created.departmentIds,
          isActive: created.isActive,
        },
      });
    } catch (error: any) {
      console.error("Error creating department head:", error);
      res.status(500).json({ error: "Failed to create department head" });
    }
  },

  // Login Department Head
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      // Find user by email
      const [user] = await db
        .select()
        .from(departmentHeadSchema)
        .where(eq(departmentHeadSchema.email, email));

      // Check if user exists
      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          error: "Account is deactivated. Please contact administrator.",
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }

      // Check if JWT_SECRET is available for token generation
      if (!JWT_SECRET) {
        return res.status(500).json({
          error:
            "Authentication service is not properly configured. Please contact administrator.",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          email: user.email,
          roleId: user.roleId,
          type: "department_head", // Add type for better token management
        },
        JWT_SECRET
      );

      // Return success response
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          departmentIds: user.departmentIds,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error("Error during department head login:", error);
      res.status(500).json({
        error: "Login failed. Please try again.",
      });
    }
  },

  // Reset Password
  async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;

      // Validate required fields
      if (!email || !newPassword) {
        return res.status(400).json({
          error: "Email and new password are required",
        });
      }

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(departmentHeadSchema)
        .where(eq(departmentHeadSchema.email, email));

      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user is active
      if (!existingUser.isActive) {
        return res.status(400).json({
          error: "Cannot reset password for deactivated account",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      const [updated] = await db
        .update(departmentHeadSchema)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(departmentHeadSchema.email, email))
        .returning();

      res.status(200).json({
        message: "Password reset successful",
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          isActive: updated.isActive,
        },
      });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      res.status(500).json({
        error: "Failed to reset password. Please try again.",
      });
    }
  },

  // Get all Department Heads
  async getAll(_req: Request, res: Response) {
    try {
      const all = await db.select().from(departmentHeadSchema);
      res.status(200).json({
        message: "Department heads retrieved successfully",
        count: all.length,
        data: all,
      });
    } catch (error: any) {
      console.error("Error fetching department heads:", error);
      res.status(500).json({
        error: "Failed to fetch department heads",
      });
    }
  },

  // Get Department Head by ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Department head ID is required" });
      }

      const [found] = await db
        .select()
        .from(departmentHeadSchema)
        .where(eq(departmentHeadSchema.id, id));

      if (!found) {
        return res.status(404).json({ error: "Department head not found" });
      }

      // Get department information for the department IDs
      const departmentIds = normalizeToArray(found.departmentIds);
      let departments: any[] = [];

      if (departmentIds.length > 0) {
        // Fetch department details for each department ID
        const departmentPromises = departmentIds.map(async (deptId) => {
          const [dept] = await db
            .select()
            .from(departmentSchema)
            .where(eq(departmentSchema.id, deptId));
          return dept;
        });

        departments = await Promise.all(departmentPromises);
        departments = departments.filter((dept) => dept); // Remove any undefined results
      }

      // Set active department ID (first department ID if available)
      const activeDepartmentId =
        departmentIds.length > 0 ? departmentIds[0] : null;

      // Prepare response with department information
      const responseData = {
        ...found,
        departments: departments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          isActive: dept.isActive,
        })),
        activeDepartmentId,
      };

      res.status(200).json({
        message: "Department head retrieved successfully",
        data: responseData,
      });
    } catch (error: any) {
      console.error("Error fetching department head:", error);
      res.status(500).json({
        error: "Failed to fetch department head",
      });
    }
  },

  // Update Department Head
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password, roleId, departmentIds, isActive } =
        req.body;

      // Check if department head exists
      const [existingHead] = await db
        .select()
        .from(departmentHeadSchema)
        .where(eq(departmentHeadSchema.id, id));

      if (!existingHead) {
        return res.status(404).json({ error: "Department head not found" });
      }

      // Build update data - only include fields that are provided
      const updateData: any = {
        updatedAt: new Date(),
      };

      // Only update name if provided
      if (name !== undefined) {
        updateData.name = name;
      }

      // Only update email if provided and check for duplicates
      if (email !== undefined) {
        if (email !== existingHead.email) {
          const emailExists = await db
            .select()
            .from(departmentHeadSchema)
            .where(eq(departmentHeadSchema.email, email));

          if (emailExists.length > 0) {
            return res.status(409).json({ error: "Email already exists" });
          }
        }
        updateData.email = email;
      }

      // Only update roleId if provided
      if (roleId !== undefined) {
        updateData.roleId = roleId;
      }

      // Only update isActive if provided
      if (isActive !== undefined) {
        updateData.isActive = isActive;
      }

      // Only update password if provided
      if (password !== undefined) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Only update departmentIds if provided
      if (departmentIds !== undefined) {
        const normalizedDeptIds = normalizeToArray(departmentIds);

        // Check if departments are already assigned to other heads (excluding current head)
        if (normalizedDeptIds.length > 0) {
          const allDepartmentHeads = await db
            .select()
            .from(departmentHeadSchema);

          for (const deptId of normalizedDeptIds) {
            for (const otherHead of allDepartmentHeads) {
              // Skip the current head being updated
              if (otherHead.id === id) continue;

              const headDepts = normalizeToArray(otherHead.departmentIds);
              if (headDepts.includes(deptId)) {
                return res.status(409).json({
                  error: `Department with ID ${deptId} is already assigned to department head: ${otherHead.name}`,
                });
              }
            }
          }
        }
        updateData.departmentIds = normalizedDeptIds;
      }

      const [updated] = await db
        .update(departmentHeadSchema)
        .set(updateData)
        .where(eq(departmentHeadSchema.id, id))
        .returning();

      res.status(200).json({
        message: "Department head updated successfully",
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          roleId: updated.roleId,
          departmentIds: updated.departmentIds,
          isActive: updated.isActive,
        },
      });
    } catch (error: any) {
      console.error("Error updating department head:", error);
      res.status(500).json({ error: "Failed to update department head" });
    }
  },

  // Delete Department Head
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ error: "Department head ID is required" });
      }

      // Check if department head exists before deleting
      const [existingHead] = await db
        .select()
        .from(departmentHeadSchema)
        .where(eq(departmentHeadSchema.id, id));

      if (!existingHead) {
        return res.status(404).json({ error: "Department head not found" });
      }

      const [deleted] = await db
        .delete(departmentHeadSchema)
        .where(eq(departmentHeadSchema.id, id))
        .returning();

      res.status(200).json({
        message: "Department head deleted successfully",
        deletedUser: {
          id: deleted.id,
          name: deleted.name,
          email: deleted.email,
        },
      });
    } catch (error: any) {
      console.error("Error deleting department head:", error);
      res.status(500).json({
        error: "Failed to delete department head",
      });
    }
  },

  // Get available departments (not assigned to any head)
  async getAvailableDepartments(_req: Request, res: Response) {
    try {
      const allDepartments = await db.select().from(departmentSchema);
      const allDepartmentHeads = await db.select().from(departmentHeadSchema);

      // Get all assigned department IDs
      const assignedDepartmentIds = new Set<string>();
      allDepartmentHeads.forEach((head) => {
        const headDepts = normalizeToArray(head.departmentIds);
        headDepts.forEach((deptId) => assignedDepartmentIds.add(deptId));
      });

      // Filter out assigned departments
      const availableDepartments = allDepartments.filter(
        (dept) => !assignedDepartmentIds.has(dept.id)
      );

      res.status(200).json({
        message: "Available departments retrieved successfully",
        count: availableDepartments.length,
        data: availableDepartments,
      });
    } catch (error: any) {
      console.error("Error getting available departments:", error);
      res.status(500).json({ error: "Failed to get available departments" });
    }
  },

  // Get technicians
  async getTechnicians(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;

      if (!departmentId) {
        return res.status(400).json({ error: "Department ID is required" });
      }

      const technicians = await db
        .select()
        .from(technicianUser)
        .where(eq(technicianUser.departmentId, departmentId));

      res.status(200).json({
        message: "Technicians retrieved successfully",
        data: technicians,
      });
    } catch (error: any) {
      console.error("Error getting technicians:", error);
      res.status(500).json({ error: "Failed to get technicians" });
    }
  },

  // ✅ GET orders assigned to a department and waiting for inward
  async getWaitingInward(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      if (!departmentId) {
        return res.status(400).json({ error: "Department ID is required" });
      }

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          error:
            "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
        });
      }

      // Get total count for pagination
      const totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(orderFlowSchema)
        .innerJoin(
          labOrderSchema,
          eq(orderFlowSchema.orderId, labOrderSchema.orderId)
        )
        .innerJoin(orderSchema, eq(labOrderSchema.orderId, orderSchema.id))
        .where(
          and(
            eq(orderFlowSchema.departmentId, departmentId),
            eq(orderFlowSchema.isCurrent, true),
            eq(orderFlowSchema.status, "waiting_inward")
          )
        );

      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Fetch orders in 'waiting_inward' status for this department with pagination
      const waitingOrders = await db
        .select({
          id: orderFlowSchema.id,
          flowStatus: orderFlowSchema.status,
          orderFlowCreatedAt: orderFlowSchema.createdAt,
          departmentId: orderFlowSchema.departmentId,

          orderId: labOrderSchema.orderId, // actual order.id (not lab order id)
          orderNumber: labOrderSchema.orderNumber,
          priority: labOrderSchema.priority,
          dueDate: labOrderSchema.dueDate,
          labCreatedAt: labOrderSchema.createdAt,
          prescriptionTypesId: orderSchema.prescriptionTypesId,
          patientName:
            sql`${patients.firstName} || ' ' || ${patients.lastName}`.as(
              "patientName"
            ),
          doctorName: clinicInformation.caseHandleBy,
          clinicName: clinic.clinicName,
        })
        .from(orderFlowSchema)
        .innerJoin(
          labOrderSchema,
          eq(orderFlowSchema.orderId, labOrderSchema.orderId) // join lab_order using flow.orderId
        )
        .innerJoin(
          orderSchema,
          eq(labOrderSchema.orderId, orderSchema.id) // join orders using lab_order.orderId = orders.id
        )
        .leftJoin(
          clinicInformation,
          eq(orderSchema.clinicInformationId, clinicInformation.id)
        )
        .leftJoin(
          patients,
          eq(orderSchema.patientId, patients.id) // join patient using order.patientId
        )
        .leftJoin(clinic, eq(orderSchema.clinicId, clinic.id))
        .where(
          and(
            eq(orderFlowSchema.departmentId, departmentId),
            eq(orderFlowSchema.isCurrent, true),
            eq(orderFlowSchema.status, "waiting_inward")
          )
        )
        .orderBy(orderFlowSchema.createdAt)
        .limit(limit)
        .offset(offset);

      return res.status(200).json({
        message: "Waiting inward orders retrieved successfully",
        data: waitingOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    } catch (error: any) {
      console.error("Error getting waiting inward orders:", error);
      return res
        .status(500)
        .json({ error: "Failed to get waiting inward orders" });
    }
  },

  // ✅ Mark order as inwarded by head
  async inward(req: Request, res: Response) {
    try {
      const { flowId } = req.params;
      const [flow] = await db
        .select()
        .from(orderFlowSchema)
        .where(eq(orderFlowSchema.id, flowId));

      if (!flow) return res.status(404).json({ error: "Order flow not found" });

      if (flow.status !== "waiting_inward")
        return res.status(400).json({ error: "Order is not in inward stage" });

      await db
        .update(orderFlowSchema)
        .set({ status: "inward_pending" })
        .where(eq(orderFlowSchema.id, flowId));

      return res.status(200).json({ message: "Order inwarded successfully" });
    } catch (error) {
      console.error("Error in inward:", error);
      res.status(500).json({ error: "Failed to inward order" });
    }
  },

  // ✅ Get orders that are inwarded but not assigned to technician
  async getInwardPending(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      if (!departmentId) {
        return res.status(400).json({ error: "Department ID is required" });
      }

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          error:
            "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
        });
      }

      // Get total count for pagination
      const totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(orderFlowSchema)
        .innerJoin(
          labOrderSchema,
          eq(orderFlowSchema.orderId, labOrderSchema.orderId)
        )
        .innerJoin(orderSchema, eq(labOrderSchema.orderId, orderSchema.id))
        .where(
          and(
            eq(orderFlowSchema.departmentId, departmentId),
            eq(orderFlowSchema.isCurrent, true),
            eq(orderFlowSchema.status, "inward_pending"),
            isNull(orderFlowSchema.technicianId)
          )
        );

      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Fetch orders in 'inward_pending' status for this department with pagination
      const inwardPendingOrders = await db
        .select({
          id: orderFlowSchema.id,
          flowStatus: orderFlowSchema.status,
          orderFlowCreatedAt: orderFlowSchema.createdAt,
          departmentId: orderFlowSchema.departmentId,
          technicianId: orderFlowSchema.technicianId,

          orderId: labOrderSchema.orderId, // actual order.id (not lab order id)
          orderNumber: labOrderSchema.orderNumber,
          priority: labOrderSchema.priority,
          dueDate: labOrderSchema.dueDate,
          labCreatedAt: labOrderSchema.createdAt,
          prescriptionTypesId: orderSchema.prescriptionTypesId,
          patientName:
            sql`${patients.firstName} || ' ' || ${patients.lastName}`.as(
              "patientName"
            ),
          doctorName: clinicInformation.caseHandleBy,
          clinicName: clinic.clinicName,
        })
        .from(orderFlowSchema)
        .innerJoin(
          labOrderSchema,
          eq(orderFlowSchema.orderId, labOrderSchema.orderId) // join lab_order using flow.orderId
        )
        .innerJoin(
          orderSchema,
          eq(labOrderSchema.orderId, orderSchema.id) // join orders using lab_order.orderId = orders.id
        )
        .leftJoin(
          clinicInformation,
          eq(orderSchema.clinicInformationId, clinicInformation.id)
        )
        .leftJoin(
          patients,
          eq(orderSchema.patientId, patients.id) // join patient using order.patientId
        )
        .leftJoin(clinic, eq(orderSchema.clinicId, clinic.id))
        .where(
          and(
            eq(orderFlowSchema.departmentId, departmentId),
            eq(orderFlowSchema.isCurrent, true),
            eq(orderFlowSchema.status, "inward_pending"),
            isNull(orderFlowSchema.technicianId)
          )
        )
        .orderBy(orderFlowSchema.createdAt)
        .limit(limit)
        .offset(offset);

      return res.status(200).json({
        message: "Inward pending orders retrieved successfully",
        data: inwardPendingOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    } catch (error: any) {
      console.error("Error getting inward pending orders:", error);
      return res
        .status(500)
        .json({ error: "Failed to get inward pending orders" });
    }
  },

  // ✅ Get orders that are inwarded but not assigned to technician
  async getAssignedPending(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;

      const orders = await db
        .select()
        .from(orderFlowSchema)
        .where(
          and(
            eq(orderFlowSchema.departmentId, departmentId),
            eq(orderFlowSchema.isCurrent, true),
            eq(orderFlowSchema.status, "inward_pending")
          )
        );

      return res
        .status(200)
        .json({ message: "Assigned pending orders fetched", data: orders });
    } catch (error) {
      console.error("Error in getAssignedPending:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch assigned pending orders" });
    }
  },

  // ✅ Assign technician to order
  async assignTechnician(req: Request, res: Response) {
    try {
      const { flowId } = req.params;
      const { technicianId } = req.body;

      const [flow] = await db
        .select()
        .from(orderFlowSchema)
        .where(eq(orderFlowSchema.orderId, flowId));
      if (!flow) return res.status(404).json({ error: "Order flow not found" });

      if (flow.status !== "inward_pending")
        return res
          .status(400)
          .json({ error: "Order not ready for technician assignment" });

      await db
        .update(orderFlowSchema)
        .set({
          status: "assigned_pending",
          technicianId,
        })
        .where(eq(orderFlowSchema.id, flowId));

      return res
        .status(200)
        .json({ message: "Technician assigned successfully" });
    } catch (error) {
      console.error("Error in assignTechnician:", error);
      res.status(500).json({ error: "Failed to assign technician" });
    }
  },

  // ✅ Get orders where technician is assigned but not started
  async getOutwardPending(req: Request, res: Response) {
    try {
      const { departmentId } = req.params;

      const orders = await db
        .select()
        .from(orderFlowSchema)
        .where(
          and(
            eq(orderFlowSchema.departmentId, departmentId),
            eq(orderFlowSchema.isCurrent, true),
            eq(orderFlowSchema.status, "outward_pending")
          )
        );

      return res
        .status(200)
        .json({ message: "Outward pending orders fetched", data: orders });
    } catch (error) {
      console.error("Error in getOutwardPending:", error);
      res.status(500).json({ error: "Failed to fetch outward pending orders" });
    }
  },

  // ✅ Mark the order as outward and create next step for next department
  async outward(req: Request, res: Response) {
    try {
      const { flowId } = req.params;

      // Find the current flow
      const [currentFlow] = await db
        .select()
        .from(orderFlowSchema)
        .where(eq(orderFlowSchema.id, flowId));
      if (!currentFlow)
        return res.status(404).json({ error: "Order flow not found" });

      if (currentFlow.status !== "outward_pending")
        return res
          .status(400)
          .json({ error: "Order is not ready for outward" });

      // Mark current step as completed
      await db
        .update(orderFlowSchema)
        .set({ isCurrent: false })
        .where(eq(orderFlowSchema.id, flowId));

      // Determine next department from sequence
      const [labOrder] = await db
        .select()
        .from(labOrderSchema)
        .where(eq(labOrderSchema.id, currentFlow.orderId));
      if (!labOrder)
        return res.status(404).json({ error: "Lab order not found" });

      const sequence = labOrder.sequence as string[];
      const currentIndex = sequence.findIndex(
        (id) => id === currentFlow.departmentId
      );
      const nextDepartmentId = sequence[currentIndex + 1];

      // If next department exists, insert next flow step
      if (nextDepartmentId) {
        await db.insert(orderFlowSchema).values({
          orderId: currentFlow.orderId,
          departmentId: nextDepartmentId,
          flowStep: currentFlow.flowStep + 1,
          isCurrent: true,
          status: "waiting_inward",
        });
      }

      return res.status(200).json({ message: "Order outwarded successfully" });
    } catch (error) {
      console.error("Error in outward:", error);
      res.status(500).json({ error: "Failed to outward order" });
    }
  },

  // // mnage the order cycle
  // async getWaitingInward(req: Request, res: Response) {
  //   try {
  //     const { departmentId } = req.params;
  //     console.log("departmentId", departmentId);

  //     if (!departmentId) {
  //       return res.status(400).json({ error: "Department ID is required" });
  //     }

  //     // Fetch orders in 'waiting_inward' for the specified department
  //     const waitingOrders = await db
  //       .select({
  //         flowId: orderFlowSchema.id,
  //         orderId: orderFlowSchema.orderId,
  //         departmentId: orderFlowSchema.departmentId,
  //         status: orderFlowSchema.status,
  //         orderNumber: labOrderSchema.orderNumber,
  //         priority: labOrderSchema.priority,
  //         dueDate: labOrderSchema.dueDate,
  //         createdAt: labOrderSchema.createdAt,
  //       })
  //       .from(orderFlowSchema)
  //       .innerJoin(
  //         labOrderSchema,
  //         eq(orderFlowSchema.orderId, labOrderSchema.id)
  //       )
  //       .where(
  //         and(
  //           eq(orderFlowSchema.departmentId, departmentId),
  //           eq(orderFlowSchema.isCurrent, true),
  //           eq(orderFlowSchema.status, "waiting_inward")
  //         )
  //       )
  //       .orderBy(orderFlowSchema.createdAt);

  //     console.log("waitingOrders", waitingOrders);

  //     return res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: waitingOrders,
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     return res
  //       .status(500)
  //       .json({ error: "Failed to get waiting inward orders" });
  //   }
  // },

  // async inward(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },

  // async getAssignedPending(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },

  // async assignTechnician(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },

  // async getOutwardPending(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },

  // async outward(req: Request, res: Response) {
  //   try {
  //     const { id } = req.params;
  //     res.status(200).json({
  //       message: "Waiting inward orders retrieved successfully",
  //       data: [id],
  //     });
  //   } catch (error: any) {
  //     console.error("Error getting waiting inward orders:", error);
  //     res.status(500).json({ error: "Failed to get waiting inward orders" });
  //   }
  // },
};
