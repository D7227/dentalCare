import type { Express } from "express";
import { orderStorage } from "./orderController";
import { chatStorage } from "../chat/chatController";
import { QaStatusApiBody } from "./ordersType";

export const setupOrderRoutes = (app: Express) => {

  // GET OEDER BY CLINIC ID
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


  app.get("/api/orderData/:id", async (req, res) => {
    try {
      const order = await orderStorage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  });

  // GET ALL ORDER
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

  // CREATE A ORDER
  app.post("/api/orders", async (req, res) => {
    try {
      const order = await orderStorage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  });

  //UPDATE ORDER
  app.patch("/api/updateOrders/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const orderData = req.body;

      const order = await orderStorage.updateOrder(orderId, orderData);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });


  // this api for Qa
  app.patch("/api/qa/status/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const body: QaStatusApiBody = req.body;

      const updateData = await orderStorage.updateStatus(orderId , body);
      console.log(updateData,"updateData");

      res.status(201).json(updateData);
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: error });
    }
  });

  // app.get("/api/orders/filter/:id", async (req, res) => {
  //   try {
  //     const clinicId = req.params.id;
  //     if (!clinicId) {
  //       return res.status(400).json({ error: "Clinic ID is required" });
  //     }
  //     const { patientName, prescription, refId, order_id } = req.query;
  //     // Start with all orders for this clinic
  //     let orders = await orderStorage.getOrdersByClinicId(clinicId);
  //     // Filter by patient name if provided
  //     if (patientName) {
  //       const name = String(patientName).toLowerCase();
  //       orders = orders.filter(
  //         (order) =>
  //           (order.patientFirstName &&
  //             order.patientFirstName.toLowerCase().includes(name)) ||
  //           (order.patientLastName &&
  //             order.patientLastName.toLowerCase().includes(name))
  //       );
  //     }
  //     // Filter by prescription if provided
  //     if (prescription) {
  //       const presc = String(prescription).toLowerCase();
  //       orders = orders.filter(
  //         (order) =>
  //           order.prescription &&
  //           order.prescription.toLowerCase().includes(presc)
  //       );
  //     }
  //     // Filter by reference_id if provided
  //     if (refId) {
  //       orders = orders.filter(
  //         (order) => order.reference_id && order.reference_id == refId
  //       );
  //     }
  //     // Filter by order_id if provided
  //     if (order_id) {
  //       orders = orders.filter(
  //         (order) => order.order_id && order.order_id == order_id
  //       );
  //     }
  //     res.json(orders);
  //   } catch (error) {
  //     console.log("order data " , error)
  //     res.status(500).json({ error: error });
  //   }
  // });

  // Get chat by orderId
  // app.get("/api/orders/:orderId/chat", async (req, res) => {
  //   try {
  //     const chat = await chatStorage.getChatByOrderId(req.params.orderId);
  //     if (!chat) {
  //       return res.status(404).json({ error: "Chat not found for this order" });
  //     }
  //     res.json(chat);
  //   } catch (error) {
  //     res.status(500).json({ error: "Failed to fetch chat for order" });
  //   }
  // });

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
