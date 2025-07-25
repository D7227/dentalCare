import { db } from "../../database/db";
import { technicianUser } from "./technicianSchema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export class TechnicianStorage {
  async getTechnicianByEmail(email: string) {
    const [technician] = await db.select().from(technicianUser).where(eq(technicianUser.email, email));
    return technician;
  }
  async getTechnicianByMobileNumber(mobileNumber: string) {
    const [technician] = await db.select().from(technicianUser).where(eq(technicianUser.mobileNumber, mobileNumber));
    return technician;
  }
  async getTechnicianByEmployeeId(employeeId: string) {
    const [technician] = await db.select().from(technicianUser).where(eq(technicianUser.employeeId, employeeId));
    return technician;
  }
  async getTechnicianById(id: string) {
    const [technician] = await db.select().from(technicianUser).where(eq(technicianUser.id, id));
    return technician;
  }
  async createTechnician(data: any) {
    const [newTechnician] = await db.insert(technicianUser).values(data).returning();
    return newTechnician;
  }
  async updateTechnician(id: string, updates: Partial<any>) {
    const [updatedTechnician] = await db.update(technicianUser).set(updates).where(eq(technicianUser.id, id)).returning();
    return updatedTechnician;
  }
  async deleteTechnician(id: string) {
    const [deletedTechnician] = await db.delete(technicianUser).where(eq(technicianUser.id, id)).returning();
    return deletedTechnician;
  }
}

export const technicianStorage = new TechnicianStorage();

// Controller functions
export async function registerTechnician(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, mobileNumber, departmentId, employeeId, password } = req.body;
    // Check for existing email, mobile number, or employeeId
    const existingEmail = await technicianStorage.getTechnicianByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const existingMobile = await technicianStorage.getTechnicianByMobileNumber(mobileNumber);
    if (existingMobile) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }
    const existingEmployeeId = await technicianStorage.getTechnicianByEmployeeId(employeeId);
    if (existingEmployeeId) {
      return res.status(400).json({ error: "Employee ID already exists" });
    }
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
      employeeId,
      password: hashedPassword,
      profilePic,
      profilePicMimeType,
    });
    return res.status(201).json({ id: newTechnician.id, email: newTechnician.email });
  } catch (error) {
    console.error("Technician registration error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
}

export async function loginTechnician(req: Request, res: Response) {
  try {
    const { mobileNumber, password } = req.body;
    if (!mobileNumber || !password) {
      return res.status(400).json({ error: "Mobile number and password are required" });
    }
    const technician = await technicianStorage.getTechnicianByMobileNumber(mobileNumber);
    if (!technician) {
      return res.status(401).json({ error: "Technician not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, technician.password || "");
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Return JWT token only
    const token = jwt.sign({ id: technician.id }, JWT_SECRET, { expiresIn: "7d" });
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
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    // Handle file upload (store as base64 and mimetype)
    if (req.file) {
      updates.profilePic = req.file.buffer.toString("base64");
      updates.profilePicMimeType = req.file.mimetype;
    }
    const updatedTechnician = await technicianStorage.updateTechnician(id, updates);
    if (!updatedTechnician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    return res.json({ message: "Technician updated successfully", updatedTechnician });
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
    return res.json({ message: "Technician deleted successfully", deletedTechnician });
  } catch (error) {
    console.error("Technician delete error:", error);
    return res.status(500).json({ error: "Delete failed" });
  }
}

export async function getTechnicianById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const technician = await technicianStorage.getTechnicianById(id);
    if (!technician) {
      return res.status(404).json({ error: "Technician not found" });
    }
    // Attach profilePicUrl endpoint if present
    let profilePicUrl = null;
    if (technician.profilePic) {
      const baseUrl = req.protocol + '://' + req.get('host');
      profilePicUrl = `${baseUrl}/api/technician/${technician.id}/profile-pic`;
    }
    return res.json({ ...technician, profilePic: profilePicUrl });
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
