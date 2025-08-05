import { Router, type Express } from "express";
import { createLeaveRequest, updateLeaveStatus, getAllLeaveRequests, getLeaveRequestById } from "./leaveRequestController";

const leaveRequestRouter = Router();

leaveRequestRouter.post("/", createLeaveRequest);
leaveRequestRouter.patch("/:id/status", updateLeaveStatus);
leaveRequestRouter.get("/", getAllLeaveRequests);
leaveRequestRouter.get("/:id", getLeaveRequestById);

export function setupLeaveRequestRoutes(app: Express) {
  app.use("/api/leave-request", leaveRequestRouter);
}

export { leaveRequestRouter };
