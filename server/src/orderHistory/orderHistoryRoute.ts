import type { Express } from "express";
import { orderHistoryController } from "./orderHistoryController";

export const setupOrderHistoryRoutes = (app: Express) => {
  // Create or append to order history
  app.post("/api/order-history", orderHistoryController.createOrderHistory);

  // Get order history by orderId
  app.get("/api/order-history/:orderId", orderHistoryController.getOrderHistory);
};
