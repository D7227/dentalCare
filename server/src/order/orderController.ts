// Order methods

import { db } from "server/database/db";
import { eq, and, sql } from "drizzle-orm";
import { orderSchema } from "./orderSchema";
import { patientStorage } from "../patient/patientController";
import { clinicInformationStorage } from "../clinicInformation/clinicInformationController";
import { teethGroupStorage } from "../teethGroup/teethGroupcontroller";
import { OrderType } from "@/types/orderType";
import {
  doctorOrderTableType,
  FilterBody,
  qaOrderTableType,
  QaStatusApiBody,
} from "./ordersType";
import { chatStorage } from "../chat/chatController";
import { clinicStorage } from "../clinic/clinicController";
import { orderLogsStorage } from "../order_logs/orderLogsController";
import {
  labOrderSchema,
  orderFlowSchema,
} from "../departmentHead/departmentHeadSchema";
import { Request, Response } from "express";

// Mock static values
const STATIC_DUE_DATE = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // now + 5 days
const STATIC_PRIORITY = "medium";
const STATIC_SEQUENCE = [
  "1c307134-cf0b-420e-b7c3-7347acd81067", // dept-1
  "43140bd3-08c5-45e3-ba36-602cbbd56153", // dept-2
  "b9caa2f4-a8ee-461c-8d83-ed0ff1d58129", // dept-5
];

export interface orderStore {
  getOrder(id: string): Promise<any | undefined>;
  createOrder(order: any): Promise<any>;
  orderInsert(
    order: any,
    insertPatient: string,
    clinicInformation: string,
    teethGroup: string,
    isUpdate?: boolean
  ): Promise<any>;
  getOrders(): Promise<any[]>;
  getOrdersByClinicId(clinicId: string): Promise<any[]>;
  // getOrdersWithFilters(filters: {
  //   search?: string;
  //   paymentStatus?: string;
  //   type?: string;
  //   dateFrom?: string;
  //   dateTo?: string;
  //   categories?: string[];
  //   page?: number;
  //   pageSize?: number;
  // }): Promise<any[]>;
  // getOrdersWithFiltersCount(filters: {
  //   search?: string;
  //   paymentStatus?: string;
  //   type?: string;
  //   dateFrom?: string;
  //   dateTo?: string;
  //   categories?: string[];
  // }): Promise<number>;
  updateStatus(orderId: string, body: QaStatusApiBody): Promise<any[]>;
  getOrdersByPatient(patientId: string): Promise<any[]>;
  getOrderByStatus(body: FilterBody): Promise<any[]>;
  updateOrderStatus(id: string, status: string): Promise<any | undefined>;
  updateOrder(id: string, updates: Partial<any>): Promise<any | undefined>;
  getFullOrderData(order: any): Promise<any>;
  initializeData(): Promise<void>;
}

export class OrderStorage implements orderStore {
  getOrdersByPatient(patientId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  async getOrder(id: string): Promise<any | undefined> {
    const [order] = await db
      .select()
      .from(orderSchema)
      .where(eq(orderSchema.id, id));

    const orderFulldData = await this.getFullOrderData(order);
    if (!orderFulldData) {
      throw new Error("order not found");
    }
    if (!order) throw new Error("order not found");

    // Always get logs from logs table, never from order.notes
    let logsData = await orderLogsStorage.getLogsByOrderId(orderFulldData?.id);
    // If no logs exist, return an empty array instead of throwing an error
    if (!logsData) {
      logsData = { logs: [] };
    }

    // Return logs as notes for API compatibility
    return {
      ...orderFulldData,
      notes: logsData?.logs, // This is the logs array
    };
  }

  async createOrder(insertOrder: any, user?: any): Promise<any> {
    let insertPatient = null;
    let clinicInformation = null;
    let teethGroup = null;
    try {
      const patientData = {
        firstName: insertOrder.firstName,
        lastName: insertOrder.lastName,
        age: insertOrder.age,
        sex: insertOrder.sex,
      };
      insertPatient = await patientStorage.createPatient(patientData);
      if (!insertPatient) {
        throw new Error("Failed to create patient record");
      }

      const clinicInformationData = {
        clinicId: insertOrder.clinicId,
        caseHandleBy: insertOrder.caseHandleBy,
        doctorMobileNumber: insertOrder.doctorMobileNumber,
        consultingDoctorName: insertOrder?.consultingDoctorName,
        consultingDoctorMobileNumber: insertOrder?.consultingDoctorMobileNumber,
      };
      clinicInformation =
        await clinicInformationStorage.createClinicInformation(
          clinicInformationData
        );
      if (!clinicInformation) {
        throw new Error("Failed to create clinic information record");
      }
      console.log(clinicInformation);

      const teethGroupData = {
        selectedTeeth: insertOrder.selectedTeeth,
        teethGroup: insertOrder.teethGroup,
      };

      teethGroup = await teethGroupStorage.createTeethGroup(teethGroupData);
      console.log(insertOrder.courierData, "courierData");

      // Set orderByRole and orderById based on user role if not provided
      let orderByRole = insertOrder.orderByRole;
      let orderById = insertOrder.orderById;

      if (user) {
        // If user is a doctor (main_doctor), use clinicId as orderById
        if (user.roleName === "main_doctor") {
          orderByRole = orderByRole || "main_doctor";
          orderById = orderById || user.clinicId;
        }
        // If user is QA, use QA ID as orderById
        else if (user.roleName === "qa") {
          orderByRole = orderByRole || "qa";
          orderById = orderById || user.id;
        }
        // For other roles, use the provided values or defaults
        else {
          orderByRole = orderByRole || user.roleName;
          orderById = orderById || user.id;
        }
      }

      // Update the insertOrder with the determined values
      const orderDataWithRole = {
        ...insertOrder,
        orderByRole,
        orderById,
      };

      const orderToInsert = await this.orderInsert(
        orderDataWithRole,
        insertPatient.id,
        clinicInformation.id,
        teethGroup.id
      );

      // Defensive: ensure all date fields are valid Date objects or null
      const fixDate = (val: any) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (typeof val === "string") {
          const d = new Date(val);
          return isNaN(d.getTime()) ? null : d;
        }
        return null;
      };
      orderToInsert.acceptedDileveryData = fixDate(
        orderToInsert.acceptedDileveryData
      );
      orderToInsert.createdAt = new Date();
      orderToInsert.updatedAt = new Date();
      const [order] = await db
        .insert(orderSchema)
        .values(orderToInsert)
        .returning();

      const chatData = await chatStorage.getChatByOrderId(order?.id);
      if (!chatData) {
        const clinicData = await clinicStorage.getClinicById(
          order?.clinicId || ""
        );
        if (!clinicData) return "Clinic Data Not Found";

        const clinicFullname = `${clinicData?.firstname || ""} ${
          clinicData?.lastname || ""
        }`;
        const chatPayload = {
          clinicId: order?.clinicId || "",
          createdBy: clinicFullname,
          orderId: order?.id || "",
          participants: [clinicFullname, order?.orderById || ""],
          roleName: "main_doctor",
          title: order?.orderId || order?.refId || "",
          type: "order",
          userRole: "main_doctor",
        };
        const createNewChat = await chatStorage.createChat(chatPayload);
        if (!createNewChat) return "Something Went Wrong On Create Chat";

        const updateOrder = {
          ...order,
          chatId: createNewChat?.id || "",
        };
        const updateOrderData = await orderStorage.updateOrder(
          order?.id,
          updateOrder
        );
        if (!updateOrderData) return "Order Not Update";
      }

      // Only add to logs, never to order.notes
      if (order?.additionalNote) {
        const subLog = {
          addedBy: order?.orderById,
          additionalNote: order?.additionalNote,
          extraAdditionalNote: order?.extraAdditionalNote,
          createdAt: new Date(),
        };
        const logsData = {
          logs: [subLog],
          orderId: order.id,
        };
        await orderLogsStorage.createLogs(logsData);
      }

      return order;
    } catch (error) {
      // Rollback created records if error occurs
      if (insertPatient && insertPatient.id) {
        await patientStorage.deletePatient(insertPatient.id);
      }
      if (clinicInformation && clinicInformation.id) {
        await clinicInformationStorage.deleteClinicInformation(
          clinicInformation.id
        );
      }
      if (teethGroup && teethGroup.id) {
        await teethGroupStorage.deleteTeethGroup(teethGroup.id);
      }
      throw error;
    }
  }

  async updateStatus(
    orderId: string,
    body: QaStatusApiBody
  ): Promise<any | undefined> {
    const bodyData = body?.orderDate;
    const orderData = await orderStorage.getOrder(orderId);
    // Duplicate check for orderId and crateNo before updating
    console.log("orderId", orderId);
    console.log("callllllleeeeeddddd");
    console.log("body", body);
    console.log("orderData", orderData);
    if (body?.orderId) {
      const [existing] = await db
        .select()
        .from(orderSchema)
        .where(
          and(eq(orderSchema.orderId, body.orderId), sql`id != ${orderId}`)
        );
      if (existing) {
        const error: any = new Error("Order ID already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    if (body?.crateNo) {
      const [existingCrate] = await db
        .select()
        .from(orderSchema)
        .where(
          and(eq(orderSchema.crateNo, body.crateNo), sql`id != ${orderId}`)
        );
      if (existingCrate) {
        const error: any = new Error("Crate Number already exists");
        error.statusCode = 409;
        throw error;
      }
    }

    if ((body?.orderStatus || "") === "active") {
      const orderLogsData = await orderLogsStorage.getLogsByOrderId(orderId);
      if (orderLogsData?.logs?.length > 0) {
        const log = {
          addedBy: body?.userName,
          additionalNote: body?.additionalNote,
          extraAdditionalNote: body?.extraAdditionalNote,
          createdAt: new Date(),
        };
        const updateLogs = await orderLogsStorage.updateLogs(orderId, {
          logs: [...orderLogsData?.logs, log],
        });
      }
      const chatData = await chatStorage.getChatByOrderId(orderId);
      if (!chatData) {
        const clinicData = await clinicStorage.getClinicById(
          orderData?.clinicId || ""
        );

        if (!clinicData) return "Clinic Data Not Found";

        const clinicFullname = `${clinicData?.firstname || ""} ${
          clinicData?.lastname || ""
        }`;
        const chatPayload = {
          clinicId: orderData?.clinicId || "",
          createdBy: clinicFullname,
          orderId: orderData?.id || "",
          participants: [clinicFullname, body?.userName || ""],
          roleName: "main_doctor",
          title: body?.orderId || "",
          type: "order",
          userRole: "main_doctor",
        };
        const createNewChat = await chatStorage.createChat(chatPayload);

        if (!createNewChat) return "Something Went Wrong On Create Chat";

        const updateOrder = {
          ...bodyData,
          orderStatus: body?.orderStatus || orderData.orderStatus,
          orderId: body?.orderId ? body.orderId : orderData.orderId,
          crateNo: body?.crateNo ? body.crateNo : orderData.crateNo,
          qaNote: body?.qaNote || orderData.qaNote,
          qaId: body?.qaId,
        };

        const UpdateOrderData = await orderStorage.updateOrder(
          orderId,
          updateOrder
        );
        if (!UpdateOrderData) return "Order Not Update";
        return UpdateOrderData;
      } else {
        const chatParticipentList = chatData?.participants || [];
        if (!chatParticipentList.includes(body?.userName || "")) {
          const newParticipantsList = [
            ...chatParticipentList,
            body?.userName || "",
          ];

          const updateChatData = {
            ...chatData,
            participants: newParticipantsList,
          };

          const updateParticipant = await chatStorage.updateChat(
            chatData?.id || "",
            updateChatData
          );
          if (!updateParticipant) return "Chat Is Not Update";
        }
        const updateOrder = {
          ...bodyData,
          orderStatus: body?.orderStatus || orderData.orderStatus,
          orderId: body?.orderId ? body.orderId : orderData.orderId,
          crateNo: body?.crateNo ? body.crateNo : orderData.crateNo,
          qaId: body?.qaId,
        };
        const UpdateOrderData = await orderStorage.updateOrder(
          orderId,
          updateOrder
        );

        // Check if lab order already exists for this order
        const [existingLabOrder] = await db
          .select()
          .from(labOrderSchema)
          .where(eq(labOrderSchema.orderId, orderId));

        let labOrderId: string | null = null;

        if (!existingLabOrder) {
          try {
            const [newLabOrder] = await db
              .insert(labOrderSchema)
              .values({
                orderId: orderId,
                orderNumber: updateOrder?.orderId,
                orderByRole: updateOrder?.orderByRole,
                orderById: updateOrder?.orderById, // Use orderById from the order
                dueDate: STATIC_DUE_DATE.toISOString().split("T")[0], // Convert Date to date string (YYYY-MM-DD)
                priority: STATIC_PRIORITY,
                sequence: STATIC_SEQUENCE,
                status: "pending",
              })
              .returning();

            labOrderId = newLabOrder.id;
            console.log(
              `Lab order created successfully for order: ${orderId} with order number: ${updateOrder?.orderId}`
            );
            console.log("updateOrder", updateOrder);
            console.log("Lab order orderById:", updateOrder?.orderById);
            console.log("Lab order orderByRole:", updateOrder?.orderByRole);
          } catch (error) {
            console.error(
              `Error creating lab order for order ${orderId}:`,
              error
            );
          }
        } else {
          labOrderId = existingLabOrder.id;
          console.log(`Lab order already exists for order: ${orderId}`);
        }

        // Insert first step into order_flow if lab order was created successfully
        if (labOrderId) {
          try {
            // Check if order flow already exists for this lab order
            const [existingOrderFlow] = await db
              .select()
              .from(orderFlowSchema)
              .where(eq(orderFlowSchema.orderId, labOrderId));

            if (!existingOrderFlow) {
              // Validate that the department ID exists before creating the order flow
              if (STATIC_SEQUENCE[0]) {
                await db.insert(orderFlowSchema).values({
                  orderId: labOrderId, // Use the lab order ID, not the original order ID
                  departmentId: STATIC_SEQUENCE[0],
                  flowStep: 1,
                  isCurrent: true,
                  status: "waiting_inward",
                });
                console.log(
                  `Order flow created successfully for lab order: ${labOrderId} with department: ${STATIC_SEQUENCE[0]}`
                );
              } else {
                console.warn(
                  `No department ID available for order flow creation for lab order: ${labOrderId}`
                );
              }
            } else {
              console.log(
                `Order flow already exists for lab order: ${labOrderId}`
              );
            }
          } catch (error) {
            console.error(
              `Error creating order flow for lab order ${labOrderId}:`,
              error
            );
            // Don't throw error here as the main order update should still succeed
          }
        }

        if (!UpdateOrderData) return "Order Not Update";
        return UpdateOrderData;
      }
    } else if ((body?.orderStatus || "") === "rejected") {
      const orderLogsData = await orderLogsStorage.getLogsByOrderId(orderId);
      if (orderLogsData?.logs?.length > 0) {
        const log = {
          addedBy: body?.userName,
          additionalNote: body?.resonOfReject,
          extraAdditionalNote: body?.rejectNote,
          createdAt: new Date(),
        };
        const updateLogs = await orderLogsStorage.updateLogs(orderId, {
          logs: [...orderLogsData?.logs, log],
        });
      }
      const updateOrder = {
        ...bodyData,
        orderStatus: body?.orderStatus || orderData.orderStatus,
        resonOfReject: body?.resonOfReject || orderData.resonOfReject,
        qaId: body?.qaId,
      };
      const UpdateOrderData = await orderStorage.updateOrder(
        orderId,
        updateOrder
      );
      if (!UpdateOrderData) return "Order Not Update";
      return UpdateOrderData;
    } else if ((body?.orderStatus || "") === "rescan") {
      const orderLogsData = await orderLogsStorage.getLogsByOrderId(orderId);
      if (orderLogsData?.logs?.length > 0) {
        const log = {
          addedBy: body?.userName,
          additionalNote: body?.resonOfRescan,
          extraAdditionalNote: body?.additionalNote,
          createdAt: new Date(),
        };
        const updateLogs = await orderLogsStorage.updateLogs(orderId, {
          logs: [...orderLogsData?.logs, log],
        });
      }
      const updateOrder = {
        ...bodyData,
        orderStatus: body?.orderStatus || orderData.orderStatus,
        resonOfRescan: body?.resonOfRescan || orderData.resonOfRescan,
        rejectNote: body?.resonOfRescan || orderData.rejectNote,
        qaId: body?.qaId,
      };
      const UpdateOrderData = await orderStorage.updateOrder(
        orderId,
        updateOrder
      );
      if (!UpdateOrderData) return "Order Not Update";
      return UpdateOrderData;
    } else {
      // Default: just update status and related fields if provided
      const updateOrder = {
        orderStatus: body?.orderStatus || orderData.orderStatus,
        resonOfRescan: body?.resonOfRescan || orderData.resonOfRescan,
        rejectNote: body?.resonOfRescan || orderData.rejectNote,
        orderId: body?.orderId ? body.orderId : orderData.orderId,
        crateNo: body?.crateNo ? body.crateNo : orderData.crateNo,
        qaId: body?.qaId,
      };
      const UpdateOrderData = await orderStorage.updateOrder(
        orderId,
        updateOrder
      );
      if (!UpdateOrderData) return "Order Not Update";
      return UpdateOrderData;
    }
  }

  async getOrders(): Promise<any[]> {
    return await db.select().from(orderSchema);
  }

  async getOrdersByClinicId(clinicId: string): Promise<doctorOrderTableType[]> {
    // Fetch all orders for the given clinicId
    const orders = await db
      .select()
      .from(orderSchema)
      .where(eq(orderSchema.clinicId, clinicId));
    if (!orders || orders.length === 0) return [];
    let newOrderList = [];
    for (const order of orders) {
      const updateOrder = await this.getFullOrderData(order);
      const allClinicOrder: doctorOrderTableType = {
        id: updateOrder?.id,
        refId: updateOrder?.refId,
        orderId: updateOrder?.orderId,
        prescriptionTypes: updateOrder?.prescriptionTypesId,
        subPrescriptionTypes: updateOrder?.subPrescriptionTypesId,
        orderDate: updateOrder?.createdAt || updateOrder?.orderDate,
        selectedTeeth: updateOrder?.teethNumber,
        orderType: updateOrder?.orderType,
        orderStatus: updateOrder?.orderStatus,
        products: updateOrder?.products,
        paymentStatus: updateOrder?.paymentStatus || "Pandding",
        firstName: updateOrder?.firstName,
        lastName: updateOrder?.lastName,
        percentage: updateOrder?.percentage || 10,
        orderMethod: updateOrder?.orderMethod,
        logs: updateOrder?.logs || [],
        message: updateOrder?.message || "",
      };
      newOrderList.push(allClinicOrder);
    }
    // const allClinicOrder =
    return newOrderList;
  }

  async getOrderByStatus(body: FilterBody): Promise<qaOrderTableType[]> {
    const orders = await db
      .select()
      .from(orderSchema)
      .where(eq(orderSchema.orderStatus, body.status));
    let updateOrder = [];
    for (const order of orders) {
      const fullData = await this.getFullOrderData(order);
      const clinicData = await clinicStorage.getClinicById(fullData?.clinicId);
      updateOrder.push({
        id: fullData?.id,
        refId: fullData?.refId,
        orderId: fullData?.orderId,
        clinicName: clinicData?.clinicName,
        handleBy: fullData?.caseHandleBy,
        patientName: `${fullData?.firstName} ${fullData?.lastName}`,
        orderType: fullData?.orderType,
        prescription: fullData?.prescriptionTypesId,
        product: fullData?.products,
        department: fullData?.department,
        technician: fullData?.technician,
        lastStatus: fullData?.updateDate,
        orderStatus: fullData?.orderStatus,
        selectedTeeth: fullData?.teethNumber,
        files: fullData?.files?.addPatientPhotos?.length,
      } as qaOrderTableType);
    }
    return updateOrder;
  }
  //   async getChatByOrderId(orderId: string): Promise<Chat | undefined> {
  //     const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
  //     return chat;
  //   }

  async getFullOrderData(order: any): Promise<any | undefined> {
    console.log(order.patientId, "order.patientId");
    console.log(order.clinicInformationId, "order.clinicInformationId");
    const patient = order.patientId
      ? await patientStorage.getPatient(order.patientId)
      : undefined;
    console.log(patient, "patient");
    const clinicInformation = order.clinicInformationId
      ? await clinicInformationStorage.getClinicInformationById(
          order.clinicInformationId
        )
      : undefined;
    const clinicData = await clinicStorage.getClinicById(order.clinicId);
    const teethGroup = order.selectedTeethId
      ? await teethGroupStorage.getTeethGroupById(order.selectedTeethId)
      : undefined;

    // Extract all teeth numbers
    const groupTeethNumbers =
      teethGroup?.teethGroup.flatMap((group: any) =>
        (group.teethDetails || []).flat().map((tooth: any) => tooth.teethNumber)
      ) || [];
    const selectedTeethNumbers =
      (teethGroup?.selectedTeeth || []).map(
        (tooth: any) => tooth.toothNumber ?? tooth.teethNumber
      ) || [];
    let teethnumber = [...groupTeethNumbers, ...selectedTeethNumbers];
    // Remove null or undefined teeth numbers
    teethnumber = teethnumber.filter((n) => n !== null && n !== undefined);

    // --- New Product Name Count Logic ---
    const allProductNames: string[] = [];

    // Collect from selectedTeeth
    if (teethGroup?.selectedTeeth) {
      teethGroup.selectedTeeth.forEach((tooth: any) => {
        if (Array.isArray(tooth.productName)) {
          allProductNames.push(...tooth.productName);
        }
      });
    }

    // Collect from teethGroup
    if (teethGroup?.teethGroup) {
      teethGroup.teethGroup.forEach((group: any) => {
        if (Array.isArray(group.teethDetails)) {
          group.teethDetails.forEach((row: any) => {
            if (Array.isArray(row)) {
              row.forEach((tooth: any) => {
                if (Array.isArray(tooth.productName)) {
                  allProductNames.push(...tooth.productName);
                }
              });
            }
          });
        }
      });
    }

    // Count occurrences
    const productCountMap: Record<string, number> = {};
    for (const name of allProductNames) {
      if (!name) continue;
      console.log(name, "name s");
      productCountMap[name] = (productCountMap[name] || 0) + 1;
    }

    const productSummary = Object.entries(productCountMap).map(
      ([name, qty]) => ({ name, qty })
    );
    const orderData: OrderType = {
      id: order?.id,
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      age: patient?.age || 0,
      sex: patient?.sex || "",
      clinicName: clinicData?.clinicName || "",
      clinicId: clinicInformation?.clinicId || "",
      caseHandleBy: clinicInformation?.caseHandleBy || "",
      doctorMobileNumber: clinicInformation?.doctorMobileNumber || "",
      consultingDoctorName: clinicInformation?.consultingDoctorName || "",
      consultingDoctorMobileNumber:
        clinicInformation?.consultingDoctorMobileNumber || "",
      orderMethod: order.orderMethod || "",
      accessorios: (Array.isArray(order.accessorios)
        ? order.accessorios
        : []) as any,
      selectedTeeth: (Array.isArray(teethGroup?.selectedTeeth)
        ? teethGroup.selectedTeeth
        : []) as any,
      teethGroup: (Array.isArray(teethGroup?.teethGroup)
        ? teethGroup.teethGroup
        : []) as any,
      teethNumber: (Array.isArray(teethnumber) ? teethnumber : []) as any,
      products: (Array.isArray(productSummary) ? productSummary : []) as any,
      acceptedDileveryData: (() => {
        if (!order.acceptedDileveryData) return new Date();
        try {
          const date = new Date(order.acceptedDileveryData);
          return isNaN(date.getTime()) ? new Date() : date;
        } catch {
          return new Date();
        }
      })(),
      prescriptionTypesId: (Array.isArray(order.prescriptionTypesId)
        ? order.prescriptionTypesId
        : []) as any,
      subPrescriptionTypesId: (Array.isArray(order.subPrescriptionTypesId)
        ? order.subPrescriptionTypesId
        : []) as any,
      files: {
        addPatientPhotos: (Array.isArray((order.files ?? {}).addPatientPhotos)
          ? (order.files ?? {}).addPatientPhotos
          : []) as any,
        faceScan: (Array.isArray((order.files ?? {}).faceScan)
          ? (order.files ?? {}).faceScan
          : []) as any,
        intraOralScan: (Array.isArray((order.files ?? {}).intraOralScan)
          ? (order.files ?? {}).intraOralScan
          : []) as any,
        referralImages: (Array.isArray((order.files ?? {}).referralImages)
          ? (order.files ?? {}).referralImages
          : []) as any,
      } as any,
      handllingType: order.handllingType || "",
      pickupData: (Array.isArray(order.pickupData)
        ? order.pickupData
        : []) as any,
      courierData: order.courierData,
      resonOfReject: order.resonOfReject || "",
      resonOfRescan: order.resonOfRescan || "",
      rejectNote: order.rejectNote || "",
      orderId: order.orderId || "",
      crateNo: order.crateNo || "",
      qaNote: order.qaNote || "",
      orderByRole: order.orderByRole || "",
      orderById: order.orderById || "",
      lifeCycle: (Array.isArray(order.lifeCycle) ? order.lifeCycle : []) as any,
      orderStatus: order.orderStatus || "",
      refId: order.refId || "",
      orderDate: (() => {
        if (!order.orderDate) return new Date().toISOString();
        if (typeof order.orderDate === "string") return order.orderDate;
        try {
          const date = new Date(order.orderDate);
          return isNaN(date.getTime())
            ? new Date().toISOString()
            : date.toISOString();
        } catch {
          return new Date().toISOString();
        }
      })(),
      updateDate: (() => {
        if (!order.updatedAt) return new Date().toISOString();
        if (typeof order.updatedAt === "string") return order.updatedAt;
        try {
          const date = new Date(order.updatedAt);
          return isNaN(date.getTime())
            ? new Date().toISOString()
            : date.toISOString();
        } catch {
          return new Date().toISOString();
        }
      })(),
      totalAmount: order.totalAmount || "",
      paymentType: order.paymentType || "",
      doctorNote: order.doctorNote || "",
      orderType: order.orderType || "",
      paymentStatus: order.paymentStatus || "",
      percentage: order.percentage || "",
      // ...add any other fields from OrderType with appropriate fallbacks
    } as any;
    return orderData;
  }

  async updateOrderStatus(
    id: string,
    orderStatus: string
  ): Promise<any | undefined> {
    const [order] = await db
      .update(orderSchema)
      .set({ orderStatus, updatedAt: new Date() })
      .where(eq(orderSchema.id, id))
      .returning();
    return order;
  }

  async updateOrder(
    id: string,
    updates: Partial<any>
  ): Promise<any | undefined> {
    try {
      // 1. Fetch the order
      const [order] = await db
        .select()
        .from(orderSchema)
        .where(eq(orderSchema.id, id));
      if (!order) {
        return undefined;
      }

      // 2. Update patient if patient fields are present
      let patientId = order.patientId;
      if (
        patientId &&
        (updates.firstName || updates.lastName || updates.age || updates.sex)
      ) {
        try {
          const patientUpdates: any = {};
          if (updates.firstName !== undefined)
            patientUpdates.firstName = updates.firstName;
          if (updates.lastName !== undefined)
            patientUpdates.lastName = updates.lastName;
          if (updates.age !== undefined) patientUpdates.age = updates.age;
          if (updates.sex !== undefined) patientUpdates.sex = updates.sex;

          if (Object.keys(patientUpdates).length > 0) {
            await patientStorage.updatePatient(patientId, patientUpdates);
          }
        } catch (error) {
          console.error("Error updating patient:", error);
          // Continue with order update even if patient update fails
        }
      }

      // 3. Update clinicInformation if fields are present
      let clinicInformationId = order.clinicInformationId;
      if (
        clinicInformationId &&
        (updates.caseHandleBy ||
          updates.doctorMobileNumber ||
          updates.consultingDoctorName ||
          updates.consultingDoctorMobileNumber)
      ) {
        try {
          const clinicUpdates: any = {};
          if (updates.caseHandleBy !== undefined)
            clinicUpdates.caseHandleBy = updates.caseHandleBy;
          if (updates.doctorMobileNumber !== undefined)
            clinicUpdates.doctorMobileNumber = updates.doctorMobileNumber;
          if (updates.consultingDoctorName !== undefined)
            clinicUpdates.consultingDoctorName = updates.consultingDoctorName;
          if (updates.consultingDoctorMobileNumber !== undefined)
            clinicUpdates.consultingDoctorMobileNumber =
              updates.consultingDoctorMobileNumber;

          if (Object.keys(clinicUpdates).length > 0) {
            await clinicInformationStorage.updateClinicInformation(
              clinicInformationId,
              clinicUpdates
            );
          }
        } catch (error) {
          console.error("Error updating clinic information:", error);
          // Continue with order update even if clinic update fails
        }
      }

      // 4. Update teethGroup if fields are present
      let selectedTeethId = order.selectedTeethId;
      if (selectedTeethId && (updates.selectedTeeth || updates.teethGroup)) {
        try {
          const teethUpdates: any = {};
          if (updates.selectedTeeth !== undefined)
            teethUpdates.selectedTeeth = updates.selectedTeeth;
          if (updates.teethGroup !== undefined)
            teethUpdates.teethGroup = updates.teethGroup;

          if (Object.keys(teethUpdates).length > 0) {
            await teethGroupStorage.updateTeethGroup(
              selectedTeethId,
              teethUpdates
            );
          }
        } catch (error) {
          console.error("Error updating teeth group:", error);
          // Continue with order update even if teeth group update fails
        }
      }

      // 5. Prepare order update object (excluding patient/clinic/teeth fields)
      const accessorios = (
        Array.isArray(updates.accessorios) ? updates.accessorios : []
      ) as any;

      const orderUpdate: any = { ...updates, accessorios: accessorios };
      delete orderUpdate.firstName;
      delete orderUpdate.lastName;
      delete orderUpdate.age;
      delete orderUpdate.sex;
      delete orderUpdate.caseHandleBy;
      delete orderUpdate.doctorMobileNumber;
      delete orderUpdate.consultingDoctorName;
      delete orderUpdate.consultingDoctorMobileNumber;
      delete orderUpdate.selectedTeeth;
      delete orderUpdate.teethGroup;

      const orderToInsert = await this.orderInsert(
        orderUpdate,
        order.patientId || "",
        order.clinicInformationId || "",
        order.selectedTeethId || "",
        true // Indicate this is an update operation
      );
      // 6. Update the order
      const [updatedOrder] = await db
        .update(orderSchema)
        .set(orderToInsert)
        .where(eq(orderSchema.id, id))
        .returning();
      return updatedOrder;
    } catch (error: any) {
      console.error("Error updating order:", error);
      throw error;
    }
  }

  async initializeData(): Promise<void> {
    console.log("Starting order database initialization...");

    // Check if we already have orders to avoid duplicates
    const existingOrders = await this.getOrders();
    if (existingOrders.length > 0) {
      console.log("Orders database already has data, skipping initialization");
      return;
    }

    // Create basic sample orders if needed
    try {
      console.log("Creating sample orders...");

      // You can add sample orders here if needed
      // Example:
      // await this.createOrder({
      //   clinicId: "sample-clinic-id",
      //   refId: "REF001",
      //   type: "crown",
      //   status: "pending",
      //   // ... other required fields
      // });

      console.log("Order sample data created successfully");
    } catch (error) {
      console.error("Error creating order sample data:", error);
    }
  }

  async orderInsert(
    insertOrder: any,
    insertPatient: string,
    clinicInformation: string,
    teethGroup: string,
    isUpdate: boolean = false
  ): Promise<any> {
    // Helper function to safely handle date fields
    const fixDate = (val: any) => {
      if (!val) return null;
      if (val instanceof Date) return val;
      if (typeof val === "string") {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    };

    const orderToInsert = {
      ...insertOrder,
      patientId: insertPatient,
      clinicInformationId: clinicInformation,
      selectedTeethId: teethGroup,
      orderById: insertOrder.orderById, // Set orderById from the input data, preserve existing value during updates
      // Defensive: ensure all array fields are arrays
      prescriptionTypesId: Array.isArray(insertOrder.prescriptionTypesId)
        ? insertOrder.prescriptionTypesId
        : [],
      subPrescriptionTypesId: Array.isArray(insertOrder.subPrescriptionTypesId)
        ? insertOrder.subPrescriptionTypesId
        : [],
      accessorios: Array.isArray(insertOrder.accessorios)
        ? insertOrder.accessorios
        : [],
      selectedTeeth: Array.isArray(insertOrder.selectedTeeth)
        ? insertOrder.selectedTeeth
        : [],
      teethGroup: Array.isArray(insertOrder.teethGroup)
        ? insertOrder.teethGroup
        : [],
      teethNumber: Array.isArray(insertOrder.teethNumber)
        ? insertOrder.teethNumber
        : [],
      products: Array.isArray(insertOrder.products) ? insertOrder.products : [],
      pickupData: Array.isArray(insertOrder.pickupData)
        ? insertOrder.pickupData
        : [],
      courierData: insertOrder.courierData,
      lifeCycle: Array.isArray(insertOrder.lifeCycle)
        ? insertOrder.lifeCycle
        : [],
      // Safely handle date fields
      acceptedDileveryData: fixDate(insertOrder.acceptedDileveryData),
      orderDate: fixDate(insertOrder.orderDate),
      updateDate: fixDate(insertOrder.updateDate),
      createdAt:
        isUpdate && insertOrder.createdAt
          ? fixDate(insertOrder.createdAt)
          : new Date(), // Preserve original createdAt for updates, use current date for new orders
      updatedAt: new Date(), // Always set to current date for new orders
      files: {
        addPatientPhotos: Array.isArray(insertOrder.files?.addPatientPhotos)
          ? insertOrder.files.addPatientPhotos
          : [],
        faceScan: Array.isArray(insertOrder.files?.faceScan)
          ? insertOrder.files.faceScan
          : [],
        intraOralScan: Array.isArray(insertOrder.files?.intraOralScan)
          ? insertOrder.files.intraOralScan
          : [],
        referralImages: Array.isArray(insertOrder.files?.referralImages)
          ? insertOrder.files.referralImages
          : [],
      },
    };
    return orderToInsert;
  }
}

export const orderStorage = new OrderStorage();

// export const getProducts = async (req: Request, res: Response) => {
//   try {
//     const { prescriptionType, subcategoryType } = req.query;

//     // Import product storage to get products from database
//     const { productStorage } = await import("../product/productController");

//     const products = await productStorage.getProducts({
//       prescriptionType: prescriptionType as string,
//       subcategoryType: subcategoryType as string,
//     });

//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     // Fallback to original hardcoded products if database fails
//     const allProducts = [
//       // Fixed Restoration - Crown products
//       {
//         id: "1",
//         name: "Porcelain Crown",
//         category: "Crown",
//         material: "Porcelain",
//         description: "High-quality porcelain crown for anterior teeth",
//         prescriptionTypes: ["fixed-restoration"],
//         subcategoryTypes: ["crown"],
//       },
//     ];

//     // Capture query parameters for use in catch block
//     const queryPrescriptionType = req.query.prescriptionType as string;
//     const querySubcategoryType = req.query.subcategoryType as string;

//     // Filter fallback products based on prescription type and subcategory
//     let filteredProducts = allProducts;

//     if (queryPrescriptionType) {
//       filteredProducts = filteredProducts.filter((product) =>
//         product.prescriptionTypes.includes(queryPrescriptionType)
//       );
//     }

//     if (querySubcategoryType) {
//       filteredProducts = filteredProducts.filter((product) =>
//         product.subcategoryTypes.includes(querySubcategoryType)
//       );
//     }

//     // Remove the internal filtering arrays from the response
//     const products = filteredProducts.map(
//       ({ prescriptionTypes, subcategoryTypes, ...product }) => product
//     );

//     res.json(products);
//   }
// };
