// Order methods

import { db } from "server/database/db";
import { toothGroups } from "../../../shared/schema";
import { eq, and, or, sql, gte, lte, inArray } from "drizzle-orm";
import { orderSchema } from "./orderSchema";
import { v4 as uuidv4 } from 'uuid';
import { patientStorage } from "../patient/patientController";
import { clinicInformationStorage } from "../clinicInformation/clinicInformationController";
import { teethGroupStorage } from "../teethGroup/teethGroupcontroller";
import { OrderType } from "@/types/orderType";

export interface orderStore {
getOrder(id: string): Promise<any | undefined>;
createOrder(order: any): Promise<any>;
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
getOrdersByPatient(patientId: string): Promise<any[]>;
getToothGroupsByOrder(orderId: string): Promise<any[]>;
updateOrderStatus(id: string, status: string): Promise<any | undefined>;
updateOrder(id: string, updates: Partial<any>): Promise<any | undefined>;
initializeData(): Promise<void>;
}

export class OrderStorage implements orderStore {
  getOrdersByPatient(patientId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
    async getOrder(id: string): Promise<any | undefined> {
        const [order] = await db.select().from(orderSchema).where(eq(orderSchema.id, id));
        return order;
      }

      async createOrder(insertOrder: any): Promise<any> {
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
            consultingDoctorName: insertOrder.consultingDoctorName,
            consultingDoctorMobileNumber: insertOrder.consultingDoctorMobileNumber,
          };
          clinicInformation = await clinicInformationStorage.createClinicInformation(clinicInformationData);
          if (!clinicInformation) {
            throw new Error("Failed to create clinic information record");
          }

          const teethGroupData = {
            selectedTeeth: insertOrder.selectedTeeth,
            teethGroup:insertOrder.teethGroup,
          }
          
          teethGroup = await teethGroupStorage.createTeethGroup(teethGroupData);

          const orderToInsert = {
            ...insertOrder,
            patientId: insertPatient.id,
            clinicInformationId: clinicInformation.id,
            selectedTeethId:teethGroup.id,
            // teethGroupId: teethGroup?.id, // if used
          };
          if (orderToInsert.acpectedDileveryData && typeof orderToInsert.acpectedDileveryData === 'string') {
            orderToInsert.acpectedDileveryData = new Date(orderToInsert.acpectedDileveryData);
          }
          if (orderToInsert.orderDate && typeof orderToInsert.orderDate === 'string') {
            orderToInsert.orderDate = new Date(orderToInsert.orderDate);
          }
          if (orderToInsert.updateDate && typeof orderToInsert.updateDate === 'string') {
            orderToInsert.updateDate = new Date(orderToInsert.updateDate);
          }
          const [order] = await db.insert(orderSchema).values(orderToInsert).returning();
          return order;
        } catch (error) {
          // Rollback created records if error occurs
          if (insertPatient && insertPatient.id) {
            await patientStorage.deletePatient(insertPatient.id);
          }
          if (clinicInformation && clinicInformation.id) {
            await clinicInformationStorage.deleteClinicInformation(clinicInformation.id);
          }
          if (teethGroup && teethGroup.id) {
            await teethGroupStorage.deleteTeethGroup(teethGroup.id);
          }
          throw error;
        }
      }

      async getOrders(): Promise<any[]> {
        return await db.select().from(orderSchema);
      }

      async getOrdersByClinicId(clinicId: string): Promise<any[]> {
        // Fetch all orders for the given clinicId
        const orders = await db.select().from(orderSchema).where(eq(orderSchema.id, clinicId));
        if (!orders || orders.length === 0) return [];
        const results = [];
        for (const order of orders) {
          // Fetch related data
          const patient = order.patientId ? await patientStorage.getPatient(order.patientId) : undefined;
          const clinicInformation = order.clinicInformationId ? await clinicInformationStorage.getClinicInformationById(order.clinicInformationId) : undefined;
          const teethGroup = order.selectedTeethId ? await teethGroupStorage.getTeethGroupById(order.selectedTeethId) : undefined;

          // Extract all teeth numbers
          const groupTeethNumbers = teethGroup?.teethGroup.flatMap((group: any) =>
            (group.teethDetails || []).flat().map((tooth: any) => tooth.teethNumber)
          ) || [];
          const selectedTeethNumbers = (teethGroup?.selectedTeeth || []).map(
            (tooth: any) => tooth.toothNumber ?? tooth.teethNumber
          ) || [];
          const teethnumber = [...groupTeethNumbers, ...selectedTeethNumbers];

          // --- Robust Product summary logic ---
          const productMap: Record<string, number> = {};
          const addProduct = (name: string, qty: number) => {
            if (!name) return;
            if (!productMap[name]) productMap[name] = 0;
            productMap[name] += qty || 1;
          };
          // From teethGroup
          if (teethGroup?.teethGroup) {
            teethGroup.teethGroup.forEach((group: any) => {
              // Group-level selectedProducts
              (group.selectedProducts || []).forEach((prod: any) => {
                addProduct(prod.name, Number(prod.quantity) || 1);
              });
              // Teeth details
              (group.teethDetails || []).flat().forEach((tooth: any) => {
                // Tooth-level selectedProducts
                (tooth.selectedProducts || []).forEach((prod: any) => {
                  addProduct(prod.name, Number(prod.quantity) || 1);
                });
                // Tooth-level productName(s)
                if (Array.isArray(tooth.productName)) {
                  tooth.productName.forEach((name: string) => addProduct(name, Number(tooth.productQuantity) || 1));
                } else if (tooth.productName) {
                  addProduct(tooth.productName, Number(tooth.productQuantity) || 1);
                }
              });
            });
          }
          // From selectedTeeth
          if (teethGroup?.selectedTeeth) {
            teethGroup.selectedTeeth.forEach((tooth: any) => {
              // Tooth-level selectedProducts
              (tooth.selectedProducts || []).forEach((prod: any) => {
                addProduct(prod.name, Number(prod.quantity) || 1);
              });
              // Tooth-level productName(s)
              if (Array.isArray(tooth.productName)) {
                tooth.productName.forEach((name: string) => addProduct(name, Number(tooth.productQuantity) || 1));
              } else if (tooth.productName) {
                addProduct(tooth.productName, Number(tooth.productQuantity) || 1);
              }
            });
          }
          const productSummary = Object.entries(productMap).map(([name, qty]) => ({ name, qty }));
          // --- End product summary logic ---

          const orderData: OrderType = {
            firstName: patient?.firstName || '',
            lastName: patient?.lastName || '',
            age: patient?.age || 0,
            sex: patient?.sex || '',
            clinicId: clinicInformation?.clinicId || '',
            caseHandleBy: clinicInformation?.caseHandleBy || '',
            doctorMobileNumber: clinicInformation?.doctorMobileNumber || '',
            consultingDoctorName: clinicInformation?.consultingDoctorName || '',
            consultingDoctorMobileNumber: clinicInformation?.consultingDoctorMobileNumber || '',
            orderMethod: order.orderMethod || '',
            accessorios: Array.isArray(order.accessorios) ? order.accessorios : [],
            selectedTeeth: teethGroup?.selectedTeeth || [],
            teethGroup: teethGroup?.teethGroup || [],
            teethNumber: teethnumber || [],
            products: productSummary || [],
            AcpectedDileveryData: order.AcpectedDileveryData ? new Date(order.AcpectedDileveryData) : new Date(),
            prescriptionTypesId: order.prescriptionTypesId || [],
            subPrescriptionTypesId: order.subPrescriptionTypesId || [],
            files: {
              addPatientPhotos: order.files?.addPatientPhotos || [],
              faceScan: order.files?.faceScan || [],
              intraOralScan: order.files?.intraOralScan || [],
              referralImages: order.files?.referralImages || [],
            },
            handllingType: order.handllingType || '',
            pickupData: order.pickupData || [],
            courierData: order.courierData || [],
            resonOfReject: order.resonOfReject || '',
            resonOfRescan: order.resonOfRescan || '',
            rejectNote: order.rejectNote || '',
            orderId: order.orderId || '',
            crateNo: order.crateNo || '',
            qaNote: order.qaNote || '',
            orderBy: order.orderBy || '',
            lifeCycle: order.lifeCycle || [],
            orderStatus: order.orderStatus || '',
            refId: order.refId || '',
            orderDate: typeof order.orderDate === 'string' ? order.orderDate : (order.orderDate ? new Date(order.orderDate).toISOString() : new Date().toISOString()),
            updateDate: typeof order.updateDate === 'string' ? order.updateDate : (order.updateDate ? new Date(order.updateDate).toISOString() : ''),
            totalAmount: order.totalAmount || '',
            paymentType: order.paymentType || '',
            doctorNote: order.doctorNote || '',
            orderType: order.orderType || '',
            // ...add any other fields from OrderType with appropriate fallbacks
          };
          results.push(orderData);
        }
        return results;
      }


      async getToothGroupsByOrder(orderId: string): Promise<any[]> {
        console.log("orderId", orderId);
        return await db.select().from(toothGroups).where(eq(toothGroups.orderId, orderId));
      }

    //   async getChatByOrderId(orderId: string): Promise<Chat | undefined> {
    //     const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
    //     return chat;
    //   }

      async updateOrderStatus(id: string, orderStatus: string): Promise<any | undefined> {
        const [order] = await db
          .update(orderSchema)
          .set({ orderStatus })
          .where(eq(orderSchema.id, id))
          .returning();
        return order;
      }

      async updateOrder(id: string, updates: Partial<any>): Promise<any | undefined> {
        // 1. Fetch the order
        const [order] = await db.select().from(orderSchema).where(eq(orderSchema.id, id));
        if (!order) return undefined;

        // 2. Update patient if patient fields are present
        let patientId = order.patientId;
        if (patientId && (updates.firstName || updates.lastName || updates.age || updates.sex)) {
          await patientStorage.updatePatient(patientId, {
            ...(updates.firstName && { firstName: updates.firstName }),
            ...(updates.lastName && { lastName: updates.lastName }),
            ...(updates.age && { age: updates.age }),
            ...(updates.sex && { sex: updates.sex })
          });
        }

        // 3. Update clinicInformation if fields are present
        let clinicInformationId = order.clinicInformationId;
        if (clinicInformationId && (updates.caseHandleBy || updates.doctorMobileNumber || updates.consultingDoctorName || updates.consultingDoctorMobileNumber)) {
          await clinicInformationStorage.updateClinicInformation(clinicInformationId, {
            ...(updates.caseHandleBy && { caseHandleBy: updates.caseHandleBy }),
            ...(updates.doctorMobileNumber && { doctorMobileNumber: updates.doctorMobileNumber }),
            ...(updates.consultingDoctorName && { consultingDoctorName: updates.consultingDoctorName }),
            ...(updates.consultingDoctorMobileNumber && { consultingDoctorMobileNumber: updates.consultingDoctorMobileNumber })
          });
        }

        // 4. Update teethGroup if fields are present
        let selectedTeethId = order.selectedTeethId;
        if (selectedTeethId && (updates.selectedTeeth || updates.teethGroup)) {
          await teethGroupStorage.updateTeethGroup(selectedTeethId, {
            ...(updates.selectedTeeth && { selectedTeeth: updates.selectedTeeth }),
            ...(updates.teethGroup && { teethGroup: updates.teethGroup })
          });
        }

        // 5. Prepare order update object (excluding patient/clinic/teeth fields)
        const orderUpdate: any = { ...updates };
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

        // 6. Update the order
        const [updatedOrder] = await db
          .update(orderSchema)
          .set(orderUpdate)
          .where(eq(orderSchema.id, id))
          .returning();
        return updatedOrder;
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
}

export const orderStorage = new OrderStorage();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { prescriptionType, subcategoryType } = req.query;

    // Import product storage to get products from database
    const { productStorage } = await import('../product/productController');
    
    const products = await productStorage.getProducts({
      prescriptionType: prescriptionType as string,
      subcategoryType: subcategoryType as string
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to original hardcoded products if database fails
    const allProducts = [
      // Fixed Restoration - Crown products
      {
        id: "1",
        name: "Porcelain Crown",
        category: "Crown",
        material: "Porcelain",
        description: "High-quality porcelain crown for anterior teeth",
        prescriptionTypes: ["fixed-restoration"],
        subcategoryTypes: ["crown"]
      }
    ];

    // Filter fallback products based on prescription type and subcategory
    let filteredProducts = allProducts;

    if (prescriptionType) {
      filteredProducts = filteredProducts.filter(product => 
        product.prescriptionTypes.includes(prescriptionType as string)
      );
    }

    if (subcategoryType) {
      filteredProducts = filteredProducts.filter(product => 
        product.subcategoryTypes.includes(subcategoryType as string)
      );
    }

    // Remove the internal filtering arrays from the response
    const products = filteredProducts.map(({ prescriptionTypes, subcategoryTypes, ...product }) => product);

    res.json(products);
  }
};