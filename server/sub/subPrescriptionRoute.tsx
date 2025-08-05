import { Router } from "express";
import {
  getAllSubPrescriptions,
  createSubPrescription,
  updateSubPrescription,
  deleteSubPrescription,
} from "./subPrescriptionController";
import type { Express } from "express";
import multer from "multer";
import { subPrescription } from "./subPrescriptionSchema";
import { eq } from "drizzle-orm";
import { db } from "../database/db";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllSubPrescriptions);
router.get("/:id/icon", async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(subPrescription).where(eq(subPrescription.id, id));
  const subPres = result[0];
  if (!subPres || !subPres.icon) {
    return res.status(404).send("Not found");
  }
  let iconBuffer;
  if (typeof subPres.icon === "string") {
    iconBuffer = Buffer.from(subPres.icon, "base64");
  } else if (subPres.icon instanceof Buffer) {
    iconBuffer = subPres.icon;
  } else {
    return res.status(400).send("Invalid icon data");
  }
  const mimeType = subPres.iconMimeType || "image/png";
  res.setHeader("Content-Type", mimeType);
  res.send(iconBuffer);
});
router.post("/", upload.single("icon"), createSubPrescription);
router.patch("/:id", upload.single("icon"), updateSubPrescription);
router.delete("/:id", deleteSubPrescription);

export function setupSubPrescriptionRoutes(app: Express) {
  app.use("/api/sub-prescriptions", router);
}

export default router;
