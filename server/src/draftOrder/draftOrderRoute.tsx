import type { Express } from "express";
import { draftOrderStorage } from "./draftOrderController";

export const setupDraftOrderRoutes = (app: Express) => {
  // Get one draft order by id
  app.get("/api/draft-orders/:id", async (req, res) => {
    try {
      const order = await draftOrderStorage.getDraftOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Draft order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft order" });
    }
  });

  // Get all draft orders by clinicId
  app.get("/api/draft-orders/clinic/:clinicId", async (req, res) => {
    try {
      const orders = await draftOrderStorage.getDraftOrdersByClinicId(req.params.clinicId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch draft orders" });
    }
  });

  // Create a draft order
  app.post("/api/draft-orders", async (req, res) => {
    try {
      const order = await draftOrderStorage.createDraftOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
        console.log(error);
      res.status(400).json({ error: error });
    }
  });

  // Delete a draft order by id
  app.delete("/api/draft-orders/:id", async (req, res) => {
    try {
      const order = await draftOrderStorage.getDraftOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Draft order not found" });
      }
      await draftOrderStorage.deleteDraftOrder(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete draft order" });
    }
  });
};
