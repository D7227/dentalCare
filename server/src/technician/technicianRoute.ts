import { Router, type Express } from "express";
import multer from "multer";
import {
  registerTechnician,
  loginTechnician,
  updateTechnician,
  deleteTechnician,
  getTechnicianById,
  getTechnicianProfilePic,
  getAssignedOrders,
  acceptAssignment,
  markAsCompleted,
} from "./technicianController";

const technicianRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

technicianRouter.post(
  "/register",
  upload.single("profilePic"),
  registerTechnician
);
technicianRouter.post("/login", loginTechnician);
technicianRouter.patch("/:id", upload.single("profilePic"), updateTechnician);
technicianRouter.delete("/:id", deleteTechnician);
technicianRouter.get("/:id", getTechnicianById);
technicianRouter.get("/:id/profile-pic", getTechnicianProfilePic);

technicianRouter.get("/assigned/:technicianId", getAssignedOrders);

technicianRouter.post("/accept/:orderId", acceptAssignment);

technicianRouter.post("/complete/:orderId", markAsCompleted);

export function setupTechnicianRoutes(app: Express) {
  app.use("/api/technician", technicianRouter);
}

export { technicianRouter };
