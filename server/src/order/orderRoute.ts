import type { Express } from "express";
import { orderStorage } from "./orderController";
import { chatStorage } from "../chat/chatController";

export const setupOrderRoutes = (app: Express) => {
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await orderStorage.getOrdersByClinicId(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const order = await orderStorage.getOrders();
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

  app.get("/api/orders/filters/count", async (req, res) => {
    try {
      const { search, paymentStatus, type, dateFrom, dateTo, categories } =
        req.query;

      const filters = {
        search: search as string,
        paymentStatus: paymentStatus as string,
        type: type as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        categories: categories
          ? ((Array.isArray(categories)
            ? categories
            : [categories]) as string[])
          : undefined,
      };

      const count = await orderStorage.getOrdersWithFiltersCount(filters);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get orders count" });
    }
  });

  app.get("/api/orders/patient/:patientId", async (req, res) => {
    try {
      const orders = await orderStorage.getOrdersByPatient(
        req.params.patientId
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders for patient" });
    }
  });

  app.get("/api/orders/:id/tooth-groups", async (req, res) => {
    try {
      const toothGroups = await orderStorage.getToothGroupsByOrder(
        req.params.id
      );
      res.json(toothGroups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tooth groups for order" });
    }
  });

  app.get("/api/orders/filter/:id", async (req, res) => {
    try {
      const clinicId = req.params.id;
      if (!clinicId) {
        return res.status(400).json({ error: "Clinic ID is required" });
      }
      const { patientName, prescription, refId, order_id } = req.query;
      // Start with all orders for this clinic
      let orders = await orderStorage.getOrdersByClinicId(clinicId);
      // Filter by patient name if provided
      if (patientName) {
        const name = String(patientName).toLowerCase();
        orders = orders.filter(
          (order) =>
            (order.patientFirstName &&
              order.patientFirstName.toLowerCase().includes(name)) ||
            (order.patientLastName &&
              order.patientLastName.toLowerCase().includes(name))
        );
      }
      // Filter by prescription if provided
      if (prescription) {
        const presc = String(prescription).toLowerCase();
        orders = orders.filter(
          (order) =>
            order.prescription &&
            order.prescription.toLowerCase().includes(presc)
        );
      }
      // Filter by reference_id if provided
      if (refId) {
        orders = orders.filter(
          (order) => order.reference_id && order.reference_id == refId
        );
      }
      // Filter by order_id if provided
      if (order_id) {
        orders = orders.filter(
          (order) => order.order_id && order.order_id == order_id
        );
      }
      res.json(orders);
    } catch (error) {
      console.log("order data " , error)
      res.status(500).json({ error: error });
    }
  });

  // Get chat by orderId
  app.get("/api/orders/:orderId/chat", async (req, res) => {
    try {
      const chat = await chatStorage.getChatByOrderId(req.params.orderId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found for this order" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat for order" });
    }
  });
};
