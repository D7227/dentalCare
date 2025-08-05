import { Request as ExpressRequest, Response } from "express";
import { subPrescriptionSchema } from "./subPrescriptionSchema";
import { db } from "../database/db";
import { subPrescription } from "./subPrescriptionSchema";
import { prescription } from "../src/prescription/prescriptionSchema";
import { eq } from "drizzle-orm";

interface MulterRequest extends ExpressRequest {
  file?: Express.Multer.File;
}

export const getAllSubPrescriptions = async (req: ExpressRequest, res: Response) => {
  try {
    const subPrescriptions = await db.select().from(subPrescription);
    const baseUrl = req.protocol + '://' + req.get('host');
    const subPrescriptionsWithIconUrl = subPrescriptions.map(p => {
      let hasIcon = false;
      if (p.icon) {
        if (typeof p.icon === 'string') {
          hasIcon = (p.icon as string).length > 0;
        } else if (p.icon instanceof Buffer) {
          hasIcon = (p.icon as Buffer).length > 0;
        }
      }
      return {
        ...p,
        iconUrl: hasIcon ? `${baseUrl}/api/sub-prescriptions/${p.id}/icon` : null
      };
    });
    res.json(subPrescriptionsWithIconUrl);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sub-prescriptions", details: (error as Error).message });
  }
};

export const createSubPrescription = async (req: MulterRequest, res: Response) => {
  try {
    let icon = null;
    let iconMimeType = null;
    if (req.file) {
      icon = req.file.buffer.toString('base64');
      iconMimeType = req.file.mimetype;
    } else if (typeof req.body.icon === 'string') {
      icon = Buffer.from(req.body.icon, 'utf-8').toString('base64');
      iconMimeType = 'image/svg+xml';
    }
    const data = { ...req.body, icon, iconMimeType };
    // Check prescriptionId exists
    const prescriptionId = data.prescriptionId;
    const prescriptionExists = await db.select().from(prescription).where(eq(prescription.id, prescriptionId));
    if (!prescriptionExists.length) {
      return res.status(400).json({ error: 'Invalid prescriptionId: not found' });
    }
    const parseResult = subPrescriptionSchema.safeParse(data);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    const insertData = parseResult.data;
    const [newSubPrescription] = await db.insert(subPrescription).values(insertData).returning();
    res.status(201).json(newSubPrescription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sub-prescription', details: (error as Error).message });
  }
};

export const updateSubPrescription = async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;
  try {
    let updateData: any = { ...req.body };
    if ((req as any).file) {
      updateData.icon = (req as any).file.buffer;
      updateData.iconMimeType = (req as any).file.mimetype;
    } else if (req.body.icon) {
      if (typeof req.body.icon === 'string' && req.body.icon.startsWith('data:')) {
        const matches = req.body.icon.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          updateData.icon = Buffer.from(matches[2], 'base64');
          updateData.iconMimeType = matches[1];
        }
      } else if (typeof req.body.icon === 'string') {
        updateData.icon = Buffer.from(req.body.icon, 'base64');
        updateData.iconMimeType = req.body.iconMimeType || 'image/png';
      }
    }
    const parseResult = subPrescriptionSchema.partial().safeParse(updateData);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const result = await db.update(subPrescription).set(updateData).where(eq(subPrescription.id, id)).returning();
    if (!result[0]) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating sub-prescription", details: (error as Error).message });
  }
};

export const deleteSubPrescription = async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.delete(subPrescription).where(eq(subPrescription.id, id));
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(204).send({ message: "Sub-prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sub-prescription", details: (error as Error).message });
  }
};
