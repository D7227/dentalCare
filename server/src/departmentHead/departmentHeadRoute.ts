import { Router, type Express } from "express";
import { departmentHeadController } from "./departmentHeadController";
import { departmentHeadAuthMiddleware } from "../middleWare/departmentHeadMiddleware";
// import { adminAuthMiddleware } from "../middleWare/adminMiddleware";

const departmentHeadRouter = Router();

// * INFO : Public routes (no auth required)
// Login the Department-Head
departmentHeadRouter.post("/login", departmentHeadController.login);

// Reset the Password
departmentHeadRouter.post(
  "/reset-password",
  departmentHeadController.resetPassword
);

// * INFO : Admin routes (require admin auth) - Admin manages department heads
// TODO : After add the adminMiddle ware on this api call
// Admin creates department head
departmentHeadRouter.post("/", departmentHeadController.create);

// Admin gets all department heads
departmentHeadRouter.get("/", departmentHeadController.getAll);

// Department head updates the profile
departmentHeadRouter.put("/:id", departmentHeadController.update);

// Admin deletes department head
departmentHeadRouter.delete("/:id", departmentHeadController.delete);

// Admin gets available departments
departmentHeadRouter.get(
  "/available-departments",
  departmentHeadController.getAvailableDepartments
);

// * INFO : Department Head routes (require department head auth) - Department head manages themselves
// Admin gets specific department head
departmentHeadRouter.get("/:id", departmentHeadController.getById);

// * INFO : Mange the order cycle

// GET /head/waiting-inward/:departmentId
departmentHeadRouter.get(
  "/waiting-inward/:departmentId",
  departmentHeadController.getWaitingInward
);

// POST /head/inward/:flowId
departmentHeadRouter.post("/inward/:flowId", departmentHeadController.inward);

// GET /head/assigned-pending
departmentHeadRouter.get(
  "/assigned-pending/:departmentId",
  departmentHeadController.getAssignedPending
);

// POST /head/assign-technician/:flowId
departmentHeadRouter.post(
  "/assign-technician/:flowId",
  departmentHeadController.assignTechnician
);

// GET /head/outward-pending
departmentHeadRouter.get(
  "/outward-pending/:departmentId",
  departmentHeadController.getOutwardPending
);

// POST /head/outward/:flowId
departmentHeadRouter.post(
  "/outward/:flowId",
  departmentHeadController.outward
);

export function setupDepartmentHeadRoutes(app: Express) {
  app.use("/api/head", departmentHeadRouter);
}
