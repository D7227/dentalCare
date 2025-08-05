import { eq } from "drizzle-orm";
import { db } from "../../database/db";
import { orderLogs } from "./orderLogsSchema";

export interface OrderLogsStore {
  // Role methods
  getLogsByOrderId(orderId: string): Promise<any>;
  createLogs(log: any): Promise<any>;
  updateLogs(id: string, updates: Partial<any>): Promise<any>;
}

export class OrderLogsStorage implements OrderLogsStore {
  async getLogsByOrderId(orderId: string): Promise<any> {
    const [logsData] = await db
      .select()
      .from(orderLogs)
      .where(eq(orderLogs.orderId, orderId));
    return logsData;
  }

  async createLogs(log: any): Promise<any> {
    const [orderLog] = await db.insert(orderLogs).values(log).returning();
    return orderLog;
  }

  async updateLogs(id: string, updates: Partial<any>): Promise<any> {
    const [updatedLog] = await db
      .update(orderLogs)
      .set(updates)
      .where(eq(orderLogs.orderId, id))
      .returning();
    return updatedLog;
  }
}

export const orderLogsStorage = new OrderLogsStorage();
