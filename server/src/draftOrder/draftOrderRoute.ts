import { Router, type Express } from "express";
import {
  getDraftOrderById,
  getDraftOrdersByClinicId,
  createDraftOrder,
  deleteDraftOrder,
} from "./draftOrderController";
import { authMiddleware } from "../middleWare/middleWare";

const draftOrderRouter = Router();

draftOrderRouter.get("/:id", getDraftOrderById);
draftOrderRouter.get("/clinic/:clinicId", getDraftOrdersByClinicId);
draftOrderRouter.post("/", createDraftOrder);
draftOrderRouter.delete("/:id", deleteDraftOrder);

export function setupDraftOrderRoutes(app: Express) {
  app.use("/api/draft-orders", draftOrderRouter);
}

export { draftOrderRouter };
