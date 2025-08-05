import { db } from "server/database/db";
import { orderHistorySchema } from "./orderHistorySchema";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const orderHistoryController = {
  // Create or append to order history
  async createOrderHistory(req: Request, res: Response) {
    try {
      const { orderId, historyEntry, updatedBy } = req.body;
      if (!orderId || !historyEntry) {
        return res.status(400).json({ error: "orderId and historyEntry are required" });
      }
        // Create new history row
        const [created] = await db
          .insert(orderHistorySchema)
          .values({
            orderId,
            history: [historyEntry],
            updatedBy: updatedBy || null,
            updatedAt: new Date(),
          })
          .returning();
        return res.status(201).json(created);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create order history" });
    }
  },

  // Get order history by orderId
  async getOrderHistory(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.status(400).json({ error: "orderId is required" });
      }
      const [history] = await db
        .select()
        .from(orderHistorySchema)
        .where(eq(orderHistorySchema.orderId, orderId));
      if (!history) {
        return res.status(404).json({ error: "Order history not found" });
      }
      res.status(200).json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch order history" });
    }
  },
};
