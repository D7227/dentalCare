import type { Express } from "express";
import { draftOrderStorage } from "./draftOrderController";
import { insertDraftOrderSchema } from "./draftOrderSchema";

export const setupDraftOrderRoutes = (app: Express) => {
  app.post("/api/draft-orders", async (req, res) => {
    try {
      const draftOrderData = insertDraftOrderSchema.parse(req.body);
      const draftOrder = await draftOrderStorage.createDraftOrder(draftOrderData);
      res.status(201).json(draftOrder);
    } catch (error) {
      res.status(400).json({ error: "Invalid draft order data", details: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/draft-orders/clinic/:clinicId", async (req, res) => {
    try {
      const { clinicId } = req.params;
      const draftOrders = await draftOrderStorage.getDraftOrdersByClinicId(clinicId);
      res.json(draftOrders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft orders" });
    }
  });
};
