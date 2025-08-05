import { Router } from "express";
import {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "./prescriptionController";
import type { Express } from "express";
import multer from "multer";
import { prescription } from "./prescriptionSchema";
import { eq } from "drizzle-orm";
import { db } from "../../database/db";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllPrescriptions);
router.get("/:id", getPrescriptionById);
router.get("/:id/icon", async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(prescription).where(eq(prescription.id, id));
  const pres = result[0];
  if (!pres || !pres.icon) {
    return res.status(404).send("Not found");
  }
  // If icon is base64 string, convert to Buffer
  let iconBuffer;
  if (typeof pres.icon === "string") {
    iconBuffer = Buffer.from(pres.icon, "base64");
  } else if (pres.icon instanceof Buffer) {
    iconBuffer = pres.icon;
  } else {
    return res.status(400).send("Invalid icon data");
  }
  const mimeType = pres.iconMimeType || "image/png";
  res.setHeader("Content-Type", mimeType);
  res.send(iconBuffer);
});
router.post("/", upload.single("icon"), createPrescription);
router.patch("/:id", upload.single("icon"), updatePrescription);
router.delete("/:id", deletePrescription);

export function setupPrescriptionRoutes(app: Express) {
  app.use("/api/prescriptions", router);
}

export default router;
