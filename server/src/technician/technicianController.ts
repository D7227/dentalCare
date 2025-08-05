import { db } from "../../database/db";
import { technicianUser } from "./technicianSchema";
import { and, eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RolesStorage } from "../role/roleController";
import {
  labOrderSchema,
  orderFlowSchema,
  departmentSchema,
} from "../departmentHead/departmentHeadSchema";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export class TechnicianStorage {
  async getTechnicianByEmail(email: string) {
    const [technician] = await db
      .select()
      .from(technicianUser)
      .where(eq(technicianUser.email, email));
    return technician;
  }
  async getTechnicianByMobileNumber(mobileNumber: string) {
    const [technician] = await db
      .select()
      .from(technicianUser)
      .where(eq(technicianUser.mobileNumber, mobileNumber));
    return technician;
  }
  async getTechnicianByEmployeeId(employeeId: string) {
    const [technician] = await db
      .select()
      .from(technicianUser)
      .where(eq(technicianUser.employeeId, employeeId));
    return technician;
  }
  async getTechnicianById(id: string) {
    const [technician] = await db
      .select()
      .from(technicianUser)
      .where(eq(technicianUser.id, id));
    return technician;
  }
  async createTechnician(data: any) {
    const [newTechnician] = await db
      .insert(technicianUser)
      .values(data)
      .returning();
    return newTechnician;
  }
  async updateTechnician(id: string, updates: Partial<any>) {
    const [updatedTechnician] = await db
      .update(technicianUser)
      .set(updates)
      .where(eq(technicianUser.id, id))
      .returning();
    return updatedTechnician;
  }
  async deleteTechnician(id: string) {
    const [deletedTechnician] = await db
      .delete(technicianUser)
      .where(eq(technicianUser.id, id))
      .returning();
    return deletedTechnician;
  }
}

export const technicianStorage = new TechnicianStorage();

// Controller functions
// ! Done
export async function registerTechnician(req: Request, res: Response) {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      departmentId,
      employeeId,
      password,
      status = "active", // Default to active if not provided
    } = req.body;
    // Check for existing email, mobile number, or employeeId
    const existingEmail = await technicianStorage.getTechnicianByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingMobile = await technicianStorage.getTechnicianByMobileNumber(
      mobileNumber
    );
    if (existingMobile) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }
    const existingEmployeeId =
      await technicianStorage.getTechnicianByEmployeeId(employeeId);
    if (existingEmployeeId) {
      return res.status(400).json({ error: "Employee ID already exists" });
    }
    if (!departmentId) {
      return res.status(400).json({ error: "Please select the department" });
    }

    // Validate status
    if (status && !["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Status must be either 'active' or 'inactive'" });
    }
    const technicianRoleName = "technician";
    const roleData = await RolesStorage.getRoleByName(technicianRoleName);
    const roleId = roleData?.id;
    // Handle file upload (store as base64 and mimetype)
    let profilePic = undefined;
    let profilePicMimeType = undefined;
    if (req.file) {
      profilePic = req.file.buffer.toString("base64");
      profilePicMimeType = req.file.mimetype;
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTechnician = await technicianStorage.createTechnician({
      firstName,
      lastName,
      email,
      mobileNumber,
      departmentId,
      roleId: roleId,
      employeeId,
      password: hashedPassword,
      profilePic,
      profilePicMimeType,
      status, // Use the status from request body or default
    });
    return res
      .status(201)
      .json({ id: newTechnician.id, email: newTechnician.email });
  } catch (error) {
    console.error("Technician registration error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
}

// ! DOne
export async function loginTechnician(req: Request, res: Response) {
  try {
    const { mobileNumber, password } = req.body;
    if (!mobileNumber || !password) {
      return res
        .status(400)
        .json({ error: "Mobile number and password are required" });
    }
    const technician = await technicianStorage.getTechnicianByMobileNumber(
      mobileNumber
    );
    if (!technician) {
      return res.status(401).json({ error: "Technician not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      technician.password || ""
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Return JWT token only
    const token = jwt.sign({ id: technician.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch (error) {
    console.error("Technician login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function updateTechnician(req: Request, res: Response) {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    // Check if technician exists
    const existingTechnician = await technicianStorage.getTechnicianById(id);
    if (!existingTechnician) {
      return res.status(404).json({ error: "Technician not found" });
    }

    // Validate unique fields if they're being updated
    if (updates.email && updates.email !== existingTechnician.email) {
      const existingEmail = await technicianStorage.getTechnicianByEmail(
        updates.email
      );
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Validate status if it's being updated
    if (updates.status && !["active", "inactive"].includes(updates.status)) {
      return res
        .status(400)
        .json({ error: "Status must be either 'active' or 'inactive'" });
    }

    if (
      updates.mobileNumber &&
      updates.mobileNumber !== existingTechnician.mobileNumber
    ) {
      const existingMobile =
        await technicianStorage.getTechnicianByMobileNumber(
          updates.mobileNumber
        );
      if (existingMobile) {
        return res.status(400).json({ error: "Mobile number already exists" });
      }
    }

    if (
      updates.employeeId &&
      updates.employeeId !== existingTechnician.employeeId
    ) {
      const existingEmployeeId =
        await technicianStorage.getTechnicianByEmployeeId(updates.employeeId);
      if (existingEmployeeId) {
        return res.status(400).json({ error: "Employee ID already exists" });
      }
    }

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Handle file upload (store as base64 and mimetype)
    if (req.file) {
      updates.profilePic = req.file.buffer.toString("base64");
      updates.profilePicMimeType = req.file.mimetype;
    }

    const updatedTechnician = await technicianStorage.updateTechnician(
      id,
      updates
    );

    // Get department and role information for the response
    let departmentName = null;
    let roleName = null;

    if (updatedTechnician.departmentId) {
      const [department] = await db
        .select({ name: departmentSchema.name })
        .from(departmentSchema)
        .where(eq(departmentSchema.id, updatedTechnician.departmentId));
      departmentName = department?.name;
    }

    if (updatedTechnician.roleId) {
      const role = await RolesStorage.getRoleById(updatedTechnician.roleId);
      roleName = role?.name;
    }

    const responseData = {
      ...updatedTechnician,
      departmentName,
      roleName,
      status: updatedTechnician.status || "active",
    };

    return res.json({
      message: "Technician updated successfully",
      updatedTechnician: responseData,
    });
  } catch (error) {
    console.error("Technician update error:", error);
    return res.status(500).json({ error: "Update failed" });
  }
}

export async function deleteTechnician(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedTechnician = await technicianStorage.deleteTechnician(id);
    if (!deletedTechnician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    return res.json({
      message: "Technician deleted successfully",
      deletedTechnician,
    });
  } catch (error) {
    console.error("Technician delete error:", error);
    return res.status(500).json({ error: "Delete failed" });
  }
}

export async function getTechnicianById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Technician ID is required" });
    }

    const technician = await technicianStorage.getTechnicianById(id);

    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }

    // Get department name
    let departmentName = null;
    if (technician.departmentId) {
      const [department] = await db
        .select({ name: departmentSchema.name })
        .from(departmentSchema)
        .where(eq(departmentSchema.id, technician.departmentId));
      departmentName = department?.name;
    }

    // Attach profilePicUrl endpoint if present
    let profilePicUrl = null;
    if (technician.profilePic) {
      const baseUrl = req.protocol + "://" + req.get("host");
      profilePicUrl = `${baseUrl}/api/technician/${technician.id}/profile-pic`;
    }

    return res.json({
      ...technician,
      profilePic: profilePicUrl,
      departmentName,
    });
  } catch (error) {
    console.error("Get technician by id error:", error);
    return res.status(500).json({ error: "Fetch failed" });
  }
}

export async function getTechnicianProfilePic(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const technician = await technicianStorage.getTechnicianById(id);
    if (!technician || !technician.profilePic) {
      return res.status(404).send("Not found");
    }
    const buffer = Buffer.from(technician.profilePic, "base64");
    const mimeType = technician.profilePicMimeType || "image/png";
    res.setHeader("Content-Type", mimeType);
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Error serving profile pic");
  }
}

// export async function getAssignedOrders(req: Request, res: Response) {
//   try {
//     const { technicianId } = req.params;

//     if (!technicianId) {
//       return res.status(400).json({ error: "Technician ID is required" });
//     }

//     const assignedOrders = await db
//       .select({
//         flowId: orderFlowSchema.id,
//         orderId: orderFlowSchema.orderId,
//         status: orderFlowSchema.status,
//         orderNumber: labOrderSchema.orderNumber,
//         priority: labOrderSchema.priority,
//         dueDate: labOrderSchema.dueDate,
//         createdAt: labOrderSchema.createdAt,
//       })
//       .from(orderFlowSchema)
//       .innerJoin(labOrderSchema, eq(orderFlowSchema.orderId, labOrderSchema.id))
//       .where(
//         and(
//           eq(orderFlowSchema.technicianId, technicianId),
//           eq(orderFlowSchema.status, "assigned_pending"),
//           eq(orderFlowSchema.isCurrent, true)
//         )
//       );

//     return res.status(200).json({
//       message: "Assigned orders retrieved successfully",
//       data: assignedOrders,
//     });
//   } catch (error: any) {
//     console.error("Error getting assigned orders:", error);
//     return res.status(500).json({ error: "Failed to get assigned orders" });
//   }
// }

// export async function acceptAssignment(req: Request, res: Response) {
//   try {
//     const { orderId } = req.params;
//     const { technicianId } = req.body;

//     if (!technicianId || !orderId) {
//       return res
//         .status(400)
//         .json({ error: "Order ID and Technician ID are required" });
//     }

//     await db
//       .update(orderFlowSchema)
//       .set({ status: "in_progress" })
//       .where(
//         and(
//           eq(orderFlowSchema.orderId, orderId),
//           eq(orderFlowSchema.technicianId, technicianId),
//           eq(orderFlowSchema.isCurrent, true)
//         )
//       );

//     return res.status(200).json({
//       message: "Order marked as in progress",
//     });
//   } catch (error: any) {
//     console.error("Error accepting assignment:", error);
//     return res.status(500).json({ error: "Failed to accept assignment" });
//   }
// }

// export async function markAsCompleted(req: Request, res: Response) {
//   try {
//     const { orderId } = req.params;
//     const { technicianId } = req.body;

//     if (!technicianId || !orderId) {
//       return res
//         .status(400)
//         .json({ error: "Order ID and Technician ID are required" });
//     }

//     await db
//       .update(orderFlowSchema)
//       .set({ status: "outward_pending" })
//       .where(
//         and(
//           eq(orderFlowSchema.orderId, orderId),
//           eq(orderFlowSchema.technicianId, technicianId),
//           eq(orderFlowSchema.isCurrent, true),
//           eq(orderFlowSchema.status, "in_progress")
//         )
//       );

//     return res.status(200).json({
//       message: "Order marked as completed (outward pending)",
//     });
//   } catch (error: any) {
//     console.error("Error marking order as completed:", error);
//     return res.status(500).json({ error: "Failed to mark order as completed" });
//   }
// }

// Admin management endpoints
export async function getAllTechnicians(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const technicians = await db
      .select({
        id: technicianUser.id,
        firstName: technicianUser.firstName,
        lastName: technicianUser.lastName,
        email: technicianUser.email,
        mobileNumber: technicianUser.mobileNumber,
        employeeId: technicianUser.employeeId,
        departmentId: technicianUser.departmentId,
        roleId: technicianUser.roleId,
        profilePic: technicianUser.profilePic,
        profilePicMimeType: technicianUser.profilePicMimeType,
        status: technicianUser.status,
      })
      .from(technicianUser)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(technicianUser);

    // Get department names and role names
    const techniciansWithDetails = await Promise.all(
      technicians.map(async (tech) => {
        let departmentName = null;
        let roleName = null;

        if (tech.departmentId) {
          const [department] = await db
            .select({ name: departmentSchema.name })
            .from(departmentSchema)
            .where(eq(departmentSchema.id, tech.departmentId));
          departmentName = department?.name;
        }

        if (tech.roleId) {
          const role = await RolesStorage.getRoleById(tech.roleId);
          roleName = role?.name;
        }

        return {
          ...tech,
          departmentName,
          roleName,
          status: tech.status || "active",
        };
      })
    );

    return res.status(200).json({
      technicians: techniciansWithDetails,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count) || 0,
        totalPages: Math.ceil((Number(totalCount[0]?.count) || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error("Error getting all technicians:", error);
    return res.status(500).json({ error: "Failed to get technicians" });
  }
}

// ! Done
export async function getTechnicianStats(req: Request, res: Response) {
  try {
    const technicians = await db.select().from(technicianUser);
    const departments = await db.select().from(departmentSchema);

    const total = technicians.length;
    const active = technicians.filter(
      (tech) => tech.status === "active"
    ).length;
    const inactive = technicians.filter(
      (tech) => tech.status === "inactive"
    ).length;

    // Count by department
    const byDepartment: Record<string, number> = {};
    departments.forEach((dept) => {
      byDepartment[dept.name] = technicians.filter(
        (tech) => tech.departmentId === dept.id
      ).length;
    });

    return res.status(200).json({
      total,
      active,
      inactive,
      byDepartment,
    });
  } catch (error: any) {
    console.error("Error getting technician stats:", error);
    return res.status(500).json({ error: "Failed to get technician stats" });
  }
}

export async function getTechniciansByDepartment(req: Request, res: Response) {
  try {
    const { departmentId } = req.params;

    const technicians = await db
      .select({
        id: technicianUser.id,
        firstName: technicianUser.firstName,
        lastName: technicianUser.lastName,
        email: technicianUser.email,
        mobileNumber: technicianUser.mobileNumber,
        employeeId: technicianUser.employeeId,
        departmentId: technicianUser.departmentId,
        roleId: technicianUser.roleId,
        profilePic: technicianUser.profilePic,
        profilePicMimeType: technicianUser.profilePicMimeType,
        status: technicianUser.status,
      })
      .from(technicianUser)
      .where(eq(technicianUser.departmentId, departmentId));

    // Get department name and role names
    const techniciansWithDetails = await Promise.all(
      technicians.map(async (tech) => {
        let departmentName = null;
        let roleName = null;

        if (tech.departmentId) {
          const [department] = await db
            .select({ name: departmentSchema.name })
            .from(departmentSchema)
            .where(eq(departmentSchema.id, tech.departmentId));
          departmentName = department?.name;
        }

        if (tech.roleId) {
          const role = await RolesStorage.getRoleById(tech.roleId);
          roleName = role?.name;
        }

        return {
          ...tech,
          departmentName,
          roleName,
          status: tech.status || "active",
        };
      })
    );

    return res.status(200).json(techniciansWithDetails);
  } catch (error: any) {
    console.error("Error getting technicians by department:", error);
    return res
      .status(500)
      .json({ error: "Failed to get technicians by department" });
  }
}
