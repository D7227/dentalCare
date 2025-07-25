import { Request as ExpressRequest, Response } from "express";
import { prescriptionSchema } from "./prescriptionSchema";
import { db } from "../../database/db";
import { prescription } from "./prescriptionSchema";
import { eq } from "drizzle-orm";
// import your db client here (e.g., import db from '../database/db')

interface MulterRequest extends ExpressRequest {
  file?: Express.Multer.File;
}

// Placeholder for DB operations
const prescriptions: any[] = [];

export const getAllPrescriptions = async (req: ExpressRequest, res: Response) => {
  try {
    const prescriptions = await db.select().from(prescription);
    // Add iconUrl for each prescription


    
    const baseUrl = req.protocol + '://' + req.get('host');
    const prescriptionsWithIconUrl = prescriptions.map(p => {
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
        iconUrl: hasIcon ? `${baseUrl}/api/prescriptions/${p.id}/icon` : null
      };
    });
    res.json(prescriptionsWithIconUrl);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions", details: (error as Error).message });
  }
};

export const getPrescriptionById = (req: ExpressRequest, res: Response) => {
  const { id } = req.params;
  const prescription = prescriptions.find((p) => p.id === id);
  if (!prescription) return res.status(404).json({ message: "Not found" });
  res.json(prescription);
};

export const createPrescription = async (req: MulterRequest, res: Response) => {
  try {
    let icon = null;
    let iconMimeType = null;
    if (req.file) {
      icon = req.file.buffer.toString('base64');
      iconMimeType = req.file.mimetype;
    } else if (typeof req.body.icon === 'string') {
      // If icon is a string (e.g., SVG XML), convert to base64
      icon = Buffer.from(req.body.icon, 'utf-8').toString('base64');
      iconMimeType = 'image/svg+xml';
    }
    const data = { ...req.body, icon, iconMimeType };
    const parseResult = prescriptionSchema.safeParse(data);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    const insertData = parseResult.data;
    const [newPrescription] = await db.insert(prescription).values(insertData).returning();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prescription', details: (error as Error).message });
  }
};

export const updatePrescription = async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;
  try {
    let updateData: any = { ...req.body };
    // Handle icon update if present
    if ((req as any).file) {
      updateData.icon = (req as any).file.buffer;
      updateData.iconMimeType = (req as any).file.mimetype;
    } else if (req.body.icon) {
      if (typeof req.body.icon === 'string' && req.body.icon.startsWith('data:')) {
        // If icon is a data URL, extract base64
        const matches = req.body.icon.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          updateData.icon = Buffer.from(matches[2], 'base64');
          updateData.iconMimeType = matches[1];
        }
      } else if (typeof req.body.icon === 'string') {
        // Assume base64 string
        updateData.icon = Buffer.from(req.body.icon, 'base64');
        updateData.iconMimeType = req.body.iconMimeType || 'image/png';
      }
    }
    // Validate update data
    const parseResult = prescriptionSchema.partial().safeParse(updateData);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    // Update in DB
    const result = await db.update(prescription).set(updateData).where(eq(prescription.id, id)).returning();
    if (!result[0]) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating prescription", details: (error as Error).message });
  }
};

export const deletePrescription = async (req: ExpressRequest, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.delete(prescription).where(eq(prescription.id, id));
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(204).send({message: "Prescription deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error deleting prescription", details: (error as Error).message });
  }
};

// --- Frontend utility function ---
// function iconToImage(iconData, mimeType = 'image/png') {
//   if (!iconData) return '';
//   let uint8Array;
//   if (Array.isArray(iconData)) {
//     uint8Array = new Uint8Array(iconData);
//   } else if (iconData instanceof Uint8Array) {
//     uint8Array = iconData;
//   } else if (iconData instanceof ArrayBuffer) {
//     uint8Array = new Uint8Array(iconData);
//   } else {
//     return '';
//   }
//   let binary = '';
//   for (let i = 0; i < uint8Array.length; i++) {
//     binary += String.fromCharCode(uint8Array[i]);
//   }
//   const base64 = btoa(binary);
//   return `data:${mimeType};base64,${base64}`;
// }
// Usage in React/HTML:
// <img src={iconToImage(prescription.icon)} alt="icon" />
// Or to download:
// const link = document.createElement('a');
// link.href = iconToImage(prescription.icon);
// link.download = 'icon.png';
// link.click();
