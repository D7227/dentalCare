// Order methods

import { db } from "server/database/db";
import { toothGroups } from "../../../shared/schema";
import { eq, and, or, sql, gte, lte, inArray } from "drizzle-orm";
import { orderSchema } from "./orderSchema";

export interface orderStore {
getOrder(id: string): Promise<any | undefined>;
createOrder(order: any): Promise<any>;
getOrders(): Promise<any[]>;
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
        const [order] = await db.select().from(orderSchema).where(eq(orderSchema.id, id));
        return order;
      }
    
      async createOrder(insertOrder: any): Promise<any> {
        const orderData = {
          ...insertOrder,
          files: Array.isArray(insertOrder.files) ? insertOrder.files as string[] : [],
          toothGroups: Array.isArray(insertOrder.toothGroups) ? insertOrder.toothGroups : [],
          restorationProducts: Array.isArray(insertOrder.restorationProducts) ? insertOrder.restorationProducts : [],
          shade: Array.isArray(insertOrder.shade) ? insertOrder.shade as string[] : [],
          trial: insertOrder.trial || '',
          pontic: insertOrder.pontic || 'Ridge Lap',
          occlusalStaining: insertOrder.occlusalStaining || '',
          shadeGuide: Array.isArray(insertOrder.shadeGuide) ? insertOrder.shadeGuide as string[] : [],
          additionalNotes: insertOrder.additionalNotes || '',
          shadeNotes: insertOrder.shadeNotes || '',
          selectedTeeth: Array.isArray(insertOrder.selectedTeeth) ? insertOrder.selectedTeeth : [],
          implantPhoto: insertOrder.implantPhoto || '',
          implantCompany: insertOrder.implantCompany || '',
          implantRemark: insertOrder.implantRemark || '',
          issueDescription: insertOrder.issueDescription || '',
          issueCategory: insertOrder.issueCategory || '',
          repairType: insertOrder.repairType || '',
          trialApproval: insertOrder.trialApproval || false,
          reapirInstructions: insertOrder.reapirInstructions || '',
        };
        const [order] = await db.insert(orderSchema).values(orderData).returning();
        return order;
      }
    
      async getOrders(): Promise<any[]> {
        return await db.select().from(orderSchema);
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
              sql`LOWER(${orderSchema.patientFirstName}) LIKE ${searchTerm}`,
              sql`LOWER(${orderSchema.patientLastName}) LIKE ${searchTerm}`,
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