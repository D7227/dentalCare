import { Router, type Express } from "express";
import { checkIn, checkOut } from "./attendenceController";

const attendanceRouter = Router();

attendanceRouter.post("/checkin", checkIn);
attendanceRouter.post("/checkout", checkOut);

export function setupAttendanceRoutes(app: Express) {
  app.use("/api/attendance", attendanceRouter);
}

export { attendanceRouter };
