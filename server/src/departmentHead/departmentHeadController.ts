import { db } from "server/database/db";
import { departmentHeadSchema, departmentSchema } from "./departmentHeadSchema";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
          id: user.id,
          email: user.email,
          name: user.name,
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

      res.status(200).json({
        message: "Department head retrieved successfully",
        data: found,
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
};
