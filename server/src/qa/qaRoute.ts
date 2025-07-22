import type { Express } from "express";
import { qaController } from "./qaController";

export const setupQaRoutes = (app: Express) => {

// --- QA User Auth & Management ---
// Register a new QA
app.post("/api/qa/register", qaController.registerQa);

// Login QA
app.post("/api/qa/login", qaController.loginQa);

// Logout QA (dummy, stateless)
app.post("/api/qa/logout", qaController.logoutQa);

// Delete QA
app.delete("/api/qa/:id", qaController.deleteQa);

// --- QA Daily Report API Router ---
// 1. Submit a new daily report
//    POST /api/qa/daily-report
//    Body: { ...reportData }
app.post("/api/qa/daily-report", qaController.submitDailyReport);

// 2. Get today's daily report for the current QA
//    GET /api/qa/daily-report/today?qaId=...  (qaId required)
app.get("/api/qa/daily-report/today", qaController.getTodaysDailyReport);

// 3. Get all daily reports for a particular QA (with pagination)
//    GET /api/qa/daily-report?qaId=...&page=1&pageSize=20
app.get("/api/qa/daily-report", qaController.getAllDailyReports);

// 4. Get daily reports by filter (monthly, yearly, or custom date range, with pagination)
//    GET /api/qa/daily-report/filter?qaId=...&month=5&year=2024
//    GET /api/qa/daily-report/filter?qaId=...&startDate=2024-05-01&endDate=2024-05-31&page=1&pageSize=20
app.get("/api/qa/daily-report/filter", qaController.getFilteredDailyReports);

}
