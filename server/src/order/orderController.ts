// Order methods

import { db } from "server/database/db";
import { toothGroups } from "../../../shared/schema";
import { eq, and, or, sql, gte, lte, inArray } from "drizzle-orm";
import { orderSchema } from "./orderSchema";
import { v4 as uuidv4 } from 'uuid';

export interface orderStore {
getOrder(id: string): Promise<any | undefined>;
createOrder(order: any): Promise<any>;
getOrders(): Promise<any[]>;
getOrdersByClinicId(clinicId: string): Promise<any[]>;
getOrdersWithFilters(filters: {
  search?: string;
  paymentStatus?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  categories?: string[];
  page?: number;
  pageSize?: number;
}): Promise<any[]>;
getOrdersWithFiltersCount(filters: {
  search?: string;
  paymentStatus?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  categories?: string[];
}): Promise<number>;
getOrdersByPatient(patientId: string): Promise<any[]>;
getToothGroupsByOrder(orderId: string): Promise<any[]>;
updateOrderStatus(id: string, status: string): Promise<any | undefined>;
updateOrder(id: string, updates: Partial<any>): Promise<any | undefined>;
initializeData(): Promise<void>;
}

export class OrderStorage implements orderStore {
    async getOrder(id: string): Promise<any | undefined> {
        const [order] = await db.select().from(orderSchema).where(eq(orderSchema.clinicId, id));
        return order;
      }

      async createOrder(insertOrder: any): Promise<any> {
        // Clean and validate the data before insertion
        const orderData: any = {};
        
        orderData.refId = insertOrder.refId || null;
        orderData.orderId = insertOrder.orderId || null;
        orderData.category = insertOrder.category || null;
        orderData.type = insertOrder.type || null;
        orderData.firstName = insertOrder.firstName || null;
        orderData.lastName = insertOrder.lastName || null;
        orderData.age = insertOrder.age || null;
        orderData.sex = insertOrder.sex || null;
        orderData.caseHandledBy = insertOrder.caseHandledBy || null;
        orderData.doctorMobile = insertOrder.doctorMobile || null;
        orderData.consultingDoctor = insertOrder.consultingDoctor || null;
        orderData.consultingDoctorMobile = insertOrder.consultingDoctorMobile || null;
        orderData.orderMethod = insertOrder.orderMethod || null;
        orderData.prescriptionType = insertOrder.prescriptionType || null;
        orderData.subcategoryType = insertOrder.subcategoryType || null;
        orderData.restorationType = insertOrder.restorationType || null;
        orderData.productSelection = insertOrder.productSelection || null;
        orderData.orderType = insertOrder.orderType || null;
        orderData.selectedFileType = insertOrder.selectedFileType || null;
        
        // Handle JSON fields - use null for empty arrays to avoid PostgreSQL array literal issues
        orderData.selectedTeeth = Array.isArray(insertOrder.selectedTeeth) && insertOrder.selectedTeeth.length > 0 ? insertOrder.selectedTeeth : null;
        orderData.toothGroups = Array.isArray(insertOrder.toothGroups) && insertOrder.toothGroups.length > 0 ? insertOrder.toothGroups : null;
        orderData.toothNumbers = Array.isArray(insertOrder.toothNumbers) && insertOrder.toothNumbers.length > 0 ? insertOrder.toothNumbers : null;
        orderData.abutmentDetails = insertOrder.abutmentDetails || null;
        orderData.abutmentType = insertOrder.abutmentType || null;
        orderData.restorationProducts = Array.isArray(insertOrder.restorationProducts) && insertOrder.restorationProducts.length > 0 ? insertOrder.restorationProducts : null;
        
        orderData.clinicId = insertOrder.clinicId || null;
        orderData.ponticDesign = insertOrder.ponticDesign || null;
        orderData.occlusalStaining = insertOrder.occlusalStaining || null;
        orderData.shadeInstruction = insertOrder.shadeInstruction || null;
        orderData.clearance = insertOrder.clearance || null;
        
        orderData.accessories = Array.isArray(insertOrder.accessories) && insertOrder.accessories.length > 0 ? insertOrder.accessories : null;
        orderData.otherAccessory = insertOrder.otherAccessory || null;
        orderData.returnAccessories = Boolean(insertOrder.returnAccessories);
        
        orderData.notes = insertOrder.notes || null;
        orderData.files = Array.isArray(insertOrder.files) && insertOrder.files.length > 0 ? insertOrder.files : null;
        
        // Handle date fields properly - convert to Date objects or null
        orderData.expectedDeliveryDate = insertOrder.expectedDeliveryDate ? new Date(insertOrder.expectedDeliveryDate) : null;
        orderData.pickupDate = insertOrder.pickupDate ? new Date(insertOrder.pickupDate) : null;
        orderData.pickupTime = insertOrder.pickupTime || null;
        orderData.pickupRemarks = insertOrder.pickupRemarks || null;
        
        orderData.scanBooking = insertOrder.scanBooking || null;
        orderData.previousOrderId = insertOrder.previousOrderId || null;
        orderData.repairOrderId = insertOrder.repairOrderId || null;
        orderData.issueDescription = insertOrder.issueDescription || null;
        orderData.repairType = insertOrder.repairType || null;
        orderData.returnWithTrial = Boolean(insertOrder.returnWithTrial);
        orderData.teethEditedByUser = Boolean(insertOrder.teethEditedByUser);
        
        // Handle JSON scan fields
        orderData.intraOralScans = insertOrder.intraOralScans || null;
        orderData.faceScans = insertOrder.faceScans || null;
        orderData.patientPhotos = insertOrder.patientPhotos || null;
        orderData.referralFiles = insertOrder.referralFiles || null;
        
        // Additional fields from frontend that might not be in schema
        orderData.shade = Array.isArray(insertOrder.shade) && insertOrder.shade.length > 0 ? insertOrder.shade : null;
        orderData.shadeGuide = Array.isArray(insertOrder.shadeGuide) && insertOrder.shadeGuide.length > 0 ? insertOrder.shadeGuide : null;
        orderData.shadeNotes = insertOrder.shadeNotes || null;
        orderData.trial = insertOrder.trial || null;
        orderData.implantPhoto = insertOrder.implantPhoto || null;
        orderData.implantCompany = insertOrder.implantCompany || null;
        orderData.implantRemark = insertOrder.implantRemark || null;
        orderData.issueCategory = insertOrder.issueCategory || null;
        orderData.trialApproval = Boolean(insertOrder.trialApproval);
        orderData.reapirInstructions = insertOrder.reapirInstructions || null;
        orderData.additionalNotes = insertOrder.additionalNotes || null;
        orderData.selectedCompany = insertOrder.selectedCompany || null;
        orderData.handlingType = insertOrder.handlingType || null;
        
        // IMPORTANT: Remove timestamp fields that are auto-generated by the database
        // Do NOT include createdAt or updatedAt as they are handled by the database
        // The frontend sends these as strings, but the database auto-generates them
        
        // Generate UUID for the id field
        orderData.id = uuidv4();
        
        const [order] = await db.insert(orderSchema).values(orderData).returning();
        return order;
      }

      async getOrders(): Promise<any[]> {
        return await db.select().from(orderSchema);
      }

      async getOrdersByClinicId(clinicId: string): Promise<any[]> {
        return await db.select().from(orderSchema).where(eq(orderSchema.clinicId, clinicId));
      }

      async getOrdersWithFilters(filters: {
        search?: string;
        paymentStatus?: string;
        type?: string;
        dateFrom?: string;
        dateTo?: string;
        categories?: string[];
        page?: number;
        pageSize?: number;
      }): Promise<any[]> {
        const whereClauses: any[] = [];

        if (filters.paymentStatus) {
          whereClauses.push(eq(orderSchema.paymentStatus, filters.paymentStatus));
        }
        if (filters.type) {
          whereClauses.push(eq(orderSchema.type, filters.type));
        }
        if (filters.categories && filters.categories.length > 0) {
          whereClauses.push(inArray(orderSchema.category, filters.categories));
        }
        if (filters.dateFrom) {
          whereClauses.push(gte(orderSchema.createdAt, new Date(filters.dateFrom)));
        }
        if (filters.dateTo) {
          whereClauses.push(lte(orderSchema.createdAt, new Date(filters.dateTo)));
        }
        if (filters.search) {
          const searchTerm = `%${filters.search.toLowerCase()}%`;
          whereClauses.push(
            or(
              sql`LOWER(${orderSchema.patientFirstName}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.patientLastName}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.consultingDoctor}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.orderId}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.referenceId}) LIKE ${searchTerm}`
            )
          );
        }

        let query = db.select().from(orderSchema);

        if (whereClauses.length > 0) {
          query = (query as any).where(and(...whereClauses));
        }

        if (filters.page && filters.pageSize) {
          query = (query as any).limit(filters.pageSize).offset((filters.page - 1) * filters.pageSize);
        }

        return await query;
      }

      async getOrdersWithFiltersCount(filters: {
        search?: string;
        paymentStatus?: string;
        type?: string;
        dateFrom?: string;
        dateTo?: string;
        categories?: string[];
      }): Promise<number> {
        const whereClauses: any[] = [];

        if (filters.paymentStatus) {
          whereClauses.push(eq(orderSchema.paymentStatus, filters.paymentStatus));
        }
        if (filters.type) {
          whereClauses.push(eq(orderSchema.type, filters.type));
        }
        if (filters.categories && filters.categories.length > 0) {
          whereClauses.push(inArray(orderSchema.category, filters.categories));
        }
        if (filters.dateFrom) {
          whereClauses.push(gte(orderSchema.createdAt, new Date(filters.dateFrom)));
        }
        if (filters.dateTo) {
          whereClauses.push(lte(orderSchema.createdAt, new Date(filters.dateTo)));
        }
        if (filters.search) {
          const searchTerm = `%${filters.search.toLowerCase()}%`;
          whereClauses.push(
            or(
              sql`LOWER(${orderSchema.firstName}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.lastName}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.consultingDoctor}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.orderId}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.referenceId}) LIKE ${searchTerm}`
            )
          );
        }

        const query = db.select({ count: sql`COUNT(*)` }).from(orderSchema);

        if (whereClauses.length > 0) {
          const result = await (query as any).where(and(...whereClauses));
          return Number(result[0]?.count || 0);
        } else {
          const result = await query;
          return Number(result[0]?.count || 0);
        }
      }

      async getOrdersByPatient(patientId: string): Promise<any[]> {
        // Convert string patientId to number since the schema expects integer
        const patientIdNum = parseInt(patientId, 10);
        if (isNaN(patientIdNum)) {
          return [];
        }
        return await db.select().from(orderSchema).where(eq(orderSchema.patientId, patientIdNum));
      }

      async getToothGroupsByOrder(orderId: string): Promise<any[]> {
        console.log("orderId", orderId);
        return await db.select().from(toothGroups).where(eq(toothGroups.orderId, orderId));
      }

    //   async getChatByOrderId(orderId: string): Promise<Chat | undefined> {
    //     const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
    //     return chat;
    //   }

      async updateOrderStatus(id: string, status: string): Promise<any | undefined> {
        const [order] = await db
          .update(orderSchema)
          .set({ status })
          .where(eq(orderSchema.id, id))
          .returning();
        return order;
      }

      async updateOrder(id: string, updates: Partial<any>): Promise<any | undefined> {
        const updateData = {
          ...updates,
          updatedAt: new Date()
        };
        const [order] = await db
          .update(orderSchema)
          .set(updateData as any)
          .where(eq(orderSchema.id, id))
          .returning();
        return order;
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
          //   referenceId: "REF001",
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