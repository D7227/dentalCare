import { Router, type Express } from "express";
import { departmentHeadController } from "./departmentHeadController";
import { departmentHeadAuthMiddleware } from "../middleWare/departmentHeadMiddleware";

const departmentHeadRouter = Router();

// * INFO : Public routes (no auth required)
// Login the Department-Head
departmentHeadRouter.post("/login", departmentHeadController.login);

// Reset the Password
departmentHeadRouter.post(
  "/reset-password",
  departmentHeadController.resetPassword
);

// * INFO : Department Head routes (require department head auth) - Department head can access all APIs
// Department head creates new department head (temporary - will be admin only later)
departmentHeadRouter.post(
  "/",
  departmentHeadAuthMiddleware,
  departmentHeadController.create
);

// Department head get all department heads
departmentHeadRouter.get(
  "/",
  departmentHeadAuthMiddleware,
  departmentHeadController.getAll
);

// Department head deletes department head (but not themselves)
departmentHeadRouter.delete(
  "/:id",
  departmentHeadAuthMiddleware,
  departmentHeadController.delete
);

// Department head gets available departments
departmentHeadRouter.get(
  "/available-departments",
  departmentHeadAuthMiddleware,
  departmentHeadController.getAvailableDepartments
);

// Department head updates department head profile (but not themselves)
departmentHeadRouter.put(
  "/:id",
  departmentHeadAuthMiddleware,
  departmentHeadController.update
);

// Department head gets specific department head profile
departmentHeadRouter.get(
  "/:id",
  departmentHeadAuthMiddleware,
  departmentHeadController.getById
);

// * INFO : Manage the order cycle (require department head auth + department access)

// GET /head/waiting-inward/:departmentId
departmentHeadRouter.get(
  "/waiting-inward/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getWaitingInward
);

// POST /head/inward/:flowId
departmentHeadRouter.post(
  "/inward/:flowId",
  departmentHeadAuthMiddleware,
  departmentHeadController.inward
);

// GET /head/inward-pending/:departmentId
departmentHeadRouter.get(
  "/inward-pending/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getInwardPending
);

// GET /head/assigned-pending
departmentHeadRouter.get(
  "/assigned-pending/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getAssignedPending
);

// POST /head/assign-technician/:flowId
departmentHeadRouter.post(
  "/assign-technician/:flowId",
  departmentHeadAuthMiddleware,
  departmentHeadController.assignTechnician
);

// GET /head/outward-pending
departmentHeadRouter.get(
  "/outward-pending/:departmentId",
  departmentHeadAuthMiddleware,
  departmentHeadController.getOutwardPending
);

// POST /head/outward/:flowId
departmentHeadRouter.post(
  "/outward/:flowId",
  departmentHeadAuthMiddleware,
  departmentHeadController.outward
);

export function setupDepartmentHeadRoutes(app: Express) {
  app.use("/api/head", departmentHeadRouter);
}
