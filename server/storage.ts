import { db } from "./db";
import { 
  users, patients, orders, toothGroups, scanBookings, pickupRequests, bills, chats, messages, teamMembers, clinic, role, products, companies,
  type InsertUser, type User,
  type InsertPatient, type Patient,
  type InsertOrder, type Order,
  type InsertToothGroup, type ToothGroup,
  type InsertScanBooking, type ScanBooking,
  type InsertPickupRequest, type PickupRequest,
  type InsertBill, type Bill,
  type InsertChat, type Chat,
  type InsertMessage, type Message,
  type InsertTeamMember, type TeamMember,
  type InsertClinic, type Clinic,
  type InsertProduct, type Product,
  type InsertCompany, type Company,
  lifecycleStages
} from "../shared/schema";
import { eq, asc, desc } from "drizzle-orm";
import { z } from "zod";

const teamMemberInsertSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format").optional(),
  contactNumber: z.string().optional(),
  profilePicture: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  permissions: z.array(z.string()).default([]),
  status: z.string().default("active"),
  password: z.string().optional(),
  clinicName: z.string().optional(),
});

const teamMemberUpdateSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  contactNumber: z.string().optional(),
  profilePicture: z.string().optional(),
  role: z.string().min(1, "Role is required").optional(),
  permissions: z.array(z.string()).optional(),
  status: z.string().optional(),
  password: z.string().optional(),
  clinicName: z.string().optional(),
});

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByMobileNumber(mobileNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Patient methods
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatients(): Promise<Patient[]>;

  // Order methods
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrdersWithFilters(filters: {
    search?: string;
    paymentStatus?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    categories?: string[];
    page?: number;
    pageSize?: number;
  }): Promise<Order[]>;
  getOrdersWithFiltersCount(filters: {
    search?: string;
    paymentStatus?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    categories?: string[];
  }): Promise<number>;
  getOrdersByPatient(patientId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined>;

  // Tooth Group methods
  createToothGroup(toothGroup: InsertToothGroup): Promise<ToothGroup>;
  getToothGroupsByOrder(orderId: string): Promise<ToothGroup[]>;

  // Scan Booking methods
  createScanBooking(scanBooking: InsertScanBooking): Promise<ScanBooking>;
  getScanBookingsByOrder(orderId: string): Promise<ScanBooking[]>;

  // Pickup Request methods
  createPickupRequest(pickupRequest: InsertPickupRequest): Promise<PickupRequest>;
  getPickupRequestsByOrder(orderId: string): Promise<PickupRequest[]>;

  // Bill methods
  createBill(bill: InsertBill): Promise<Bill>;
  getBillsByOrder(orderId: string): Promise<Bill[]>;

  // Chat methods
  getChat(id: string): Promise<Chat | undefined>;
  createChat(chat: InsertChat): Promise<Chat>;
  getChats(userId?: string): Promise<(Chat & { unreadCount: number })[]>;
  getChatsByType(type: string): Promise<Chat[]>;
  getChatsByClinic(clinicId: string): Promise<Chat[]>;
  updateChat(id: string, updates: Partial<InsertChat>): Promise<Chat | undefined>;

  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByChat(chatId: string): Promise<Message[]>;
  getMessagesByOrder(orderId: string): Promise<Message[]>;
  markAllMessagesAsRead(chatId: string, userId: string): Promise<void>;
  getUnreadMessageCount(chatId: string, userId?: string): Promise<number>;

  // Team Member methods
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(data: InsertTeamMember): Promise<TeamMember>;
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMembersByClinic(clinicName: string): Promise<TeamMember[]>;
  updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: string): Promise<void>;
  getTeamMemberByMobileNumber(mobileNumber: string): Promise<TeamMember | undefined>;
  getTeamMemberByFullName(fullName: string): Promise<TeamMember | undefined>;

  // Clinic methods
  getClinic(id: string): Promise<Clinic | undefined>;
  getClinicByEmail(email: string): Promise<Clinic | undefined>;
  getClinicByMobileNumber(mobileNumber: string): Promise<Clinic | undefined>;
  createClinic(clinicData: InsertClinic): Promise<Clinic>;
  getClinics(): Promise<Clinic[]>;
  updateClinic(id: string, updates: Partial<InsertClinic>): Promise<Clinic | undefined>;
  getClinicByName(clinicName: string): Promise<Clinic | undefined>;

  // Role methods
  getRoleById(roleId: string): Promise<{ id: string, name: string } | undefined>;
  getRoleByName(roleName: string): Promise<{ id: string, name: string } | undefined>;

  // Product methods
  getProducts(): Promise<Product[]>;

  // Company methods
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company | undefined>;
  getCompanyNameById(id: string): Promise<string | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;

  // New method
  removeMemberFromAllChats(fullName: string): Promise<void>;

  getLifecycleStages(): Promise<any[]>;

  getChatByOrderId(orderId: string): Promise<Chat | undefined>;

  // Hard delete all messages for a chat
  deleteMessagesByChat(chatId: string): Promise<void>;

  // Hard delete a chat and its messages
  deleteChat(chatId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, username));
    return user;
  }

  async getUserByMobileNumber(mobileNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userData = {
      ...insertUser,
      id: Math.floor(Math.random() * 1000000) + 1
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const user = await db.select().from(users);
    return user;
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const patientData = {
      ...insertPatient,
      id: Math.floor(Math.random() * 1000000) + 1
    };
    const [patient] = await db.insert(patients).values(patientData).returning();
    return patient;
  }

  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
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
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
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
  }): Promise<Order[]> {
    let query = db.select().from(orders);
    const whereClauses: any[] = [];

    if (filters.paymentStatus) {
      whereClauses.push(eq(orders.paymentStatus, filters.paymentStatus));
    }
    if (filters.type) {
      whereClauses.push(eq(orders.type, filters.type));
    }
    if (filters.categories && filters.categories.length > 0) {
      whereClauses.push(orders.category.in(filters.categories));
    }
    if (filters.dateFrom) {
      whereClauses.push(orders.createdAt.gte(new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      whereClauses.push(orders.createdAt.lte(new Date(filters.dateTo)));
    }
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      whereClauses.push(
        db.or(
          db.sql`LOWER(${orders.patientFirstName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.patientLastName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.consultingDoctor}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.orderId}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.referenceId}) LIKE ${searchTerm}`
        )
      );
    }
    if (whereClauses.length > 0) {
      query = query.where(db.and(...whereClauses));
    }
    if (filters.page && filters.pageSize) {
      query = query.limit(filters.pageSize).offset((filters.page - 1) * filters.pageSize);
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
    let query = db.select({ count: db.sql`COUNT(*)` }).from(orders);
    const whereClauses: any[] = [];

    if (filters.paymentStatus) {
      whereClauses.push(eq(orders.paymentStatus, filters.paymentStatus));
    }
    if (filters.type) {
      whereClauses.push(eq(orders.type, filters.type));
    }
    if (filters.categories && filters.categories.length > 0) {
      whereClauses.push(orders.category.in(filters.categories));
    }
    if (filters.dateFrom) {
      whereClauses.push(orders.createdAt.gte(new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      whereClauses.push(orders.createdAt.lte(new Date(filters.dateTo)));
    }
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      whereClauses.push(
        db.or(
          db.sql`LOWER(${orders.patientFirstName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.patientLastName}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.consultingDoctor}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.orderId}) LIKE ${searchTerm}`,
          db.sql`LOWER(${orders.referenceId}) LIKE ${searchTerm}`
        )
      );
    }
    if (whereClauses.length > 0) {
      query = query.where(db.and(...whereClauses));
    }
    const result = await query;
    return Number(result[0]?.count || 0);
  }

  async getOrdersByPatient(patientId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.patientId, patientId));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    const [order] = await db
      .update(orders)
      .set(updateData as any)
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async createToothGroup(insertToothGroup: InsertToothGroup): Promise<ToothGroup> {
    const toothGroupData = {
      ...insertToothGroup,
      teeth: Array.isArray(insertToothGroup.teeth) ? insertToothGroup.teeth as number[] : []
    };
    const [toothGroup] = await db.insert(toothGroups).values(toothGroupData).returning();
    return toothGroup;
  }

  async getToothGroupsByOrder(orderId: string): Promise<ToothGroup[]> {
    console.log("orderId", orderId);
    return await db.select().from(toothGroups).where(eq(toothGroups.orderId, orderId));
  }

  async createScanBooking(insertScanBooking: InsertScanBooking): Promise<ScanBooking> {
    const scanBookingData = {
      ...insertScanBooking,
      id: Math.floor(Math.random() * 1000000) + 1
    };
    const [scanBooking] = await db.insert(scanBookings).values(scanBookingData).returning();
    return scanBooking;
  }

  async getScanBookingsByOrder(orderId: string): Promise<ScanBooking[]> {
    return await db.select().from(scanBookings).where(eq(scanBookings.orderId, orderId));
  }

  async createPickupRequest(insertPickupRequest: InsertPickupRequest): Promise<PickupRequest> {
    const pickupRequestData = {
      ...insertPickupRequest,
      id: Math.floor(Math.random() * 1000000) + 1
    };
    const [pickupRequest] = await db.insert(pickupRequests).values(pickupRequestData).returning();
    return pickupRequest;
  }

  async getPickupRequestsByOrder(orderId: string): Promise<PickupRequest[]> {
    return await db.select().from(pickupRequests).where(eq(pickupRequests.orderId, orderId));
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const billData = {
      ...insertBill,
      id: Math.floor(Math.random() * 1000000) + 1
    };
    const [bill] = await db.insert(bills).values(billData).returning();
    return bill;
  }

  async getBillsByOrder(orderId: string): Promise<Bill[]> {
    return await db.select().from(bills).where(eq(bills.orderId, orderId));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    console.log("insertMessage", insertMessage);
    const messageData = {
      ...insertMessage,
      attachments: Array.isArray(insertMessage.attachments) ? insertMessage.attachments as string[] : [],
      readBy: [insertMessage.sender],
    };
    console.log("messageData", messageData);
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  async getMessagesByOrder(orderId: string): Promise<Message[]> {
    const orderChats = await db.select().from(chats).where(eq(chats.orderId, orderId));
    if (orderChats.length === 0) return [];
    
    return await db.select().from(messages).where(eq(messages.chatId, orderChats[0].id));
  }

  async getChat(id: string): Promise<Chat | undefined> {
    console.log("Getting chat", id);
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    console.log("Chat", chat);
    return chat;
  }

  async createChat(data: any) {
    const chatData = {
      ...data,
      participants: Array.isArray(data.participants) ? data.participants : [],
    };
    const [chat] = await db.insert(chats).values(chatData).returning();
    return chat;
  }

  async getChats() {
    const chatList = await db.select().from(chats);
    console.log("chatList", chatList);
    // const chatsWithUnreadCounts = await Promise.all(
    //   chatList.map(async (chat) => {
    //     const unreadCount = await this.getUnreadMessageCount(chat.id, userId);
    //     return {
    //       ...chat,
    //       unreadCount,
    //     };
    //   })
    // );
    
    return chatList;
  }

  async getChatsByType(type: string): Promise<Chat[]> {
    return await db.select().from(chats).where(eq(chats.type, type));
  }

  async getChatsByClinic(clinicId: string): Promise<Chat[]> {
    return await db.select().from(chats).where(eq(chats.clinicId, clinicId));
  }

  async updateChat(id: string, updates: Partial<InsertChat>): Promise<Chat | undefined> {
    const [chat] = await db
      .update(chats)
      .set(updates)
      .where(eq(chats.id, id))
      .returning();
    return chat;
  }

  async getMessagesByChat(chatId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(asc(messages.createdAt));
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    const [user] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id));
    return user;
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    console.log('Creating team member with data:', data);
    
    const teamMemberData = {
      ...data,
      permissions: Array.isArray(data.permissions) ? data.permissions as string[] : [],
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date()
    };
    
    console.log('Inserting team member:', teamMemberData);
    const [teamMember] = await db.insert(teamMembers).values(teamMemberData).returning();
    console.log('Team member created:', teamMember);
    return teamMember;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const members = await db.select().from(teamMembers);
    return members;
  }

  async getTeamMembersByClinic(clinicName: string): Promise<TeamMember[]> {
    const members = await db.select().from(teamMembers).where(eq(teamMembers.clinicName, clinicName));
    return members;
  }

  async updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    const [teamMember] = await db
      .update(teamMembers)
      .set(updateData as any)
      .where(eq(teamMembers.id, id))
      .returning();
    return teamMember;
  }

  /**
   * Remove a member from all chat participants lists by fullName
   */
  async removeMemberFromAllChats(fullName: string): Promise<void> {
    // Find all chats where this member is a participant
    const chatsWithMember: { id: string; participants: string[] | null }[] = await db.select({ id: chats.id, participants: chats.participants }).from(chats);
    for (const chat of chatsWithMember) {
      const participantsArr = Array.isArray(chat.participants) ? chat.participants : [];
      if (participantsArr.includes(fullName)) {
        const updatedParticipants: string[] = participantsArr.filter((p: string) => p !== fullName);
        await db.update(chats)
          .set({ participants: updatedParticipants })
          .where(eq(chats.id, chat.id));
      }
    }
  }

  async deleteTeamMember(id: string): Promise<void> {
    // Get the member's fullName before deleting
    const member = await this.getTeamMember(id);
    if (member && member.fullName) {
      await this.removeMemberFromAllChats(member.fullName);
    }
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  async getTeamMemberByMobileNumber(mobileNumber: string): Promise<TeamMember | undefined> {
    const [teamMember] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.contactNumber, mobileNumber));
    return teamMember;
  }

  async getTeamMemberByFullName(fullName: string): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.fullName, fullName));
    return member;
  }

  async initializeData() {
    console.log("Starting database initialization...");
    
    // Check if we already have data to avoid duplicates
    const existingOrders = await this.getOrders();
    if (existingOrders.length > 0) {
      console.log("Database already has data, skipping initialization");
      return;
    }

    // Create basic sample data
    try {
      await this.createPatient({ 
        firstName: "John", 
        lastName: "Doe", 
        age: "35", 
        sex: "male" 
      });
      await this.createPatient({ 
        firstName: "Jane", 
        lastName: "Smith", 
        age: "28", 
        sex: "female" 
      });

      // Create sample companies
      await db.insert(companies).values([
        { name: "Nobel Biocare" },
        { name: "Straumann" },
        { name: "Dentsply Sirona" },
        { name: "Zimmer Biomet" },
        { name: "BioHorizons" },
        { name: "MegaGen" },
        { name: "Osstem" },
        { name: "Neodent" }
      ]);
      
      console.log("Basic sample data created successfully");
    } catch (error) {
      console.error("Error creating sample data:", error);
    }
  }

  async getUnreadMessageCount(chatId: string, userId?: string): Promise<number> {
    if (!userId) {
      console.log("No userId provided, returning 0");
      return 0;
    }

    // First, get the chat to check if the user is a participant
    const chat = await this.getChat(chatId);
    if (!chat) {
      console.log(`Chat ${chatId} not found, returning 0`);
      return 0;
    }

    // Check if the user is a participant in this chat
    const participants = chat.participants || [];
    const isParticipant = participants.some((participant: string) => {
      const exactMatch = participant.toLowerCase() === userId.toLowerCase();
      const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) ||
                           userId.toLowerCase().includes(participant.toLowerCase());
      return exactMatch || containsMatch;
    });

    if (!isParticipant) {
      console.log(`User ${userId} is not a participant in chat ${chatId}, returning 0`);
      return 0;
    }

    const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
    console.log(`getUnreadMessageCount called for chatId: ${chatId}, userId: ${userId}`);
    console.log("messageList", messageList);
    
    const unreadCount = messageList.filter(message => {
      const readBy = message.readBy || [];
      const isUnread = !readBy.includes(userId);
      console.log(`Message ${message.id}: readBy=${JSON.stringify(readBy)}, isUnread=${isUnread} for user ${userId}`);
      return isUnread;
    }).length;
    
    console.log(`Total unread count for user ${userId} in chat ${chatId}: ${unreadCount}`);
    return unreadCount;
  }

  async markAllMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const messageList = await db.select().from(messages).where(eq(messages.chatId, chatId));
    for (const messageItem of messageList) {
      const currentReadBy = messageItem.readBy || [];
      if (!currentReadBy.includes(userId)) {
        const updatedReadBy = [...currentReadBy, userId];
        await db
          .update(messages)
          .set({ readBy: updatedReadBy })
          .where(eq(messages.id, messageItem.id));
      }
    }
  }

  async getClinic(id: string): Promise<Clinic | undefined> {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.id, id));
    return clinicData;
  }

  async getClinicByEmail(email: string): Promise<Clinic | undefined> {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.email, email));
    return clinicData;
  }

  async getClinicByMobileNumber(mobileNumber: string): Promise<Clinic | undefined> {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.phone, mobileNumber));
    return clinicData;
  }

  async createClinic(clinicData: InsertClinic): Promise<Clinic> {
    const [newClinic] = await db.insert(clinic).values(clinicData).returning();
    return newClinic;
  }

  async getClinics(): Promise<Clinic[]> {
    return await db.select().from(clinic);
  }

  async updateClinic(id: string, updates: Partial<InsertClinic>): Promise<Clinic | undefined> {
  //   const [updatedClinic] = await db
  //     .update(clinic)
  //     .set(updates)
  //     .where(eq(clinic.id, id))
  //     .returning();
  //   return updatedClinic;
const [updatedClinic] = await db.update(clinic).set(updates).where(eq(clinic.id, id)).returning();

console.log("updatedClinic==>",updatedClinic);
return updatedClinic;

  }

  async getClinicByName(clinicName: string): Promise<Clinic | undefined> {
    const [clinicData] = await db.select().from(clinic).where(eq(clinic.clinicName, clinicName));
    return clinicData;
  }

  async getRoleById(roleId: string): Promise<{ id: string, name: string } | undefined> {
    const [roleData] = await db.select().from(role).where(eq(role.id, roleId));
    return roleData;
  }

  async getRoleByName(roleName: string): Promise<{ id: string, name: string } | undefined> {
    const [roleData] = await db.select().from(role).where(eq(role.name, roleName));
    return roleData;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getLifecycleStages(): Promise<any[]> {
    return await db.select().from(lifecycleStages).orderBy(lifecycleStages.createdAt);
  }

  async getChatByOrderId(orderId: string): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.orderId, orderId));
    return chat;
  }

  // Company methods implementation
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async getCompanyById(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanyNameById(id: string): Promise<string | undefined> {
    const [company] = await db.select({ name: companies.name }).from(companies).where(eq(companies.id, id));
    return company?.name || undefined;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  // Hard delete all messages for a chat
  async deleteMessagesByChat(chatId: string): Promise<void> {
    await db.delete(messages).where(eq(messages.chatId, chatId));
  }

  // Hard delete a chat and its messages
  async deleteChat(chatId: string): Promise<void> {
    await this.deleteMessagesByChat(chatId);
    await db.delete(chats).where(eq(chats.id, chatId));
  }
}

export const storage = new DatabaseStorage();