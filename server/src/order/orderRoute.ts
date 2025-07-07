import type { Express } from "express";
import { orderStorage } from "./orderController";

export function setupOrderRoutes(app: Express) {

  app.get("/api/orders", async (req, res) => {
    try {
      const id = req.params
      const orders = await orderStorage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await orderStorage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const order = await orderStorage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const order = await orderStorage.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const order = await orderStorage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.get("/api/orders/filters", async (req, res) => {
    try {
      const {
        search,
        paymentStatus,
        type,
        dateFrom,
        dateTo,
        categories,
        page,
        pageSize
      } = req.query;

      const filters = {
        search: search as string,
        paymentStatus: paymentStatus as string,
        type: type as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        categories: categories ? (Array.isArray(categories) ? categories : [categories]) as string[] : undefined,
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined
      };

      const orders = await orderStorage.getOrdersWithFilters(filters);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders with filters" });
    }
  });

  app.get("/api/orders/filters/count", async (req, res) => {
    try {
      const {
        search,
        paymentStatus,
        type,
        dateFrom,
        dateTo,
        categories
      } = req.query;

      const filters = {
        search: search as string,
        paymentStatus: paymentStatus as string,
        type: type as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        categories: categories ? (Array.isArray(categories) ? categories : [categories]) as string[] : undefined
      };

      const count = await orderStorage.getOrdersWithFiltersCount(filters);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get orders count" });
    }
  });

  app.get("/api/orders/patient/:patientId", async (req, res) => {
    try {
      const orders = await orderStorage.getOrdersByPatient(req.params.patientId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders for patient" });
    }
  });

  app.get("/api/orders/:id/tooth-groups", async (req, res) => {
    try {
      const toothGroups = await orderStorage.getToothGroupsByOrder(req.params.id);
      res.json(toothGroups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tooth groups for order" });
    }
  });
}