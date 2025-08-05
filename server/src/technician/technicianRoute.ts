import { Router, type Express } from "express";
import multer from "multer";
import {
  registerTechnician,
  loginTechnician,
  updateTechnician,
  deleteTechnician,
  getTechnicianById,
  getTechnicianProfilePic,
  // getAssignedOrders,
  // acceptAssignment,
  // markAsCompleted,
  getAllTechnicians,
  getTechnicianStats,
  getTechniciansByDepartment,
} from "./technicianController";
import { eq } from "drizzle-orm";

const technicianRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Create New Technician
// ! Done
technicianRouter.post(
  "/register",
  upload.single("profilePic"),
  registerTechnician
);
// ! Done
technicianRouter.post("/login", loginTechnician);

technicianRouter.patch("/:id", upload.single("profilePic"), updateTechnician);
// ! Done // TODO: check the one logic if tecnicican is remove so taht time what is the flow
technicianRouter.delete("/:id", deleteTechnician);
// ! in progress
technicianRouter.get("/:id", getTechnicianById);

technicianRouter.get("/:id/profile-pic", getTechnicianProfilePic);

// technicianRouter.get("/assigned/:technicianId", getAssignedOrders);

// technicianRouter.post("/accept/:orderId", acceptAssignment);

// technicianRouter.post("/complete/:orderId", markAsCompleted);

// Admin management routes
technicianRouter.get("/", getAllTechnicians);
// ! Done
technicianRouter.get("/stats", getTechnicianStats);
// technicianRouter.get("/department/:departmentId", getTechniciansByDepartment);

// Department routes (for admin management)
// ! Done
technicianRouter.get("/department", async (req, res) => {
  try {
    const { db } = await import("../../database/db");
    const { departmentSchema } = await import(
      "../departmentHead/departmentHeadSchema"
    );

    const departments = await db
      .select({
        id: departmentSchema.id,
        name: departmentSchema.name,
      })
      .from(departmentSchema)
      .where(eq(departmentSchema.isActive, true));

    console.log("departments", departments);

    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to get departments" });
  }
});

export function setupTechnicianRoutes(app: Express) {
  app.use("/api/technician", technicianRouter);
}

export { technicianRouter };
