import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertPatientSchema, insertToothGroupSchema, insertTeamMemberSchema, insertChatSchema, insertMessageSchema, insertUserSchema, insertClinicSchema } from "@shared/schema";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export async function registerRoutes(app: Express): Promise<Server> {
  // Passport configuration
  passport.use(
    new LocalStrategy(
      (username, password, done) => {
        // Implement the strategy logic here
        done(null, { username });
      }
    )
  );

  // Orders API
  app.get("/api/orders", async (req, res) => {
    try {
      const { search, paymentStatus, type, dateFrom, dateTo, categories, page, pageSize } = req.query;
      const filters: any = {};
      if (search) filters.search = String(search);
      if (paymentStatus) filters.paymentStatus = String(paymentStatus);
      if (type) filters.type = String(type);
      if (dateFrom) filters.dateFrom = String(dateFrom);
      if (dateTo) filters.dateTo = String(dateTo);
      if (categories) {
        if (typeof categories === 'string') {
          filters.categories = categories.split(',').map((c) => c.trim());
        } else if (Array.isArray(categories)) {
          filters.categories = categories;
        }
      }
      if (page) filters.page = Number(page);
      if (pageSize) filters.pageSize = Number(pageSize);
      const hasAnyFilter = Object.keys(filters).length > 0;
      const orders = hasAnyFilter
        ? await storage.getOrdersWithFilters(filters)
        : await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Orders count endpoint for pagination
  app.get("/api/orders/count", async (req, res) => {
    try {
      const { search, paymentStatus, type, dateFrom, dateTo, categories } = req.query;
      const filters: any = {};
      if (search) filters.search = String(search);
      if (paymentStatus) filters.paymentStatus = String(paymentStatus);
      if (type) filters.type = String(type);
      if (dateFrom) filters.dateFrom = String(dateFrom);
      if (dateTo) filters.dateTo = String(dateTo);
      if (categories) {
        if (typeof categories === 'string') {
          filters.categories = categories.split(',').map((c) => c.trim());
        } else if (Array.isArray(categories)) {
          filters.categories = categories;
        }
      }
      const count = await storage.getOrdersWithFiltersCount(filters);
      res.json({ count });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Failed to fetch order count" });
    }
  });

  app.post("/api/create-user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/get-all-users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users data" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patient" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  // Update order endpoint
  app.put("/api/orders/:id", async (req, res) => {
    try {
      const updates = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order update data" });
    }
  });

  // Patients API
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ error: "Invalid patient data" });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Companies API
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompanyById(req.params.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.get("/api/companies/:id/name", async (req, res) => {
    try {
      const companyName = await storage.getCompanyNameById(req.params.id);
      if (!companyName) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json({ name: companyName });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company name" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = { name: req.body.name };
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  // Tooth Groups API
  app.post("/api/tooth-groups", async (req, res) => {
    try {
      console.log("Received tooth group data:", JSON.stringify(req.body, null, 2));
      const toothGroupData = insertToothGroupSchema.parse(req.body);
      console.log("Parsed tooth group data:", JSON.stringify(toothGroupData, null, 2));
      const toothGroup = await storage.createToothGroup(toothGroupData);
      res.status(201).json(toothGroup);
    } catch (error) {
      console.error("Tooth group validation error:", error);
      res.status(400).json({ 
        error: "Invalid tooth group data",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/orders/:orderId/tooth-groups", async (req, res) => {
    try {
      const toothGroups = await storage.getToothGroupsByOrder(req.params.orderId);
      res.json(toothGroups);
    } catch (error) {
      console.error("Error fetching tooth groups", error);
      res.status(500).json({ error: "Failed to fetch tooth groups" });
    }
  });

  // Team Members API
  app.get("/api/team-members", async (req, res) => {
    try {
      const { clinicName } = req.query;
      
      if (clinicName && typeof clinicName === 'string') {
        // Return team members filtered by clinic name
        const teamMembers = await storage.getTeamMembersByClinic(clinicName);
        
        // Add roleName to each team member
        const teamMembersWithRoleName = await Promise.all(
          teamMembers.map(async (member) => {
            let roleName = '';
            if (member.roleId) {
              const role = await storage.getRoleById(member.roleId);
              roleName = role?.name || '';
            }
            return {
              ...member,
              roleName
            };
          })
        );
        
        res.json(teamMembersWithRoleName);
      } else {
        // Return all team members if no clinic filter
        const teamMembers = await storage.getTeamMembers();
        
        // Add roleName to each team member
        const teamMembersWithRoleName = await Promise.all(
          teamMembers.map(async (member) => {
            let roleName = '';
            if (member.roleId) {
              const role = await storage.getRoleById(member.roleId);
              roleName = role?.name || '';
            }
            return {
              ...member,
              roleName
            };
          })
        );
        
        res.json(teamMembersWithRoleName);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.get("/api/team-members/:id", async (req, res) => {
    try {
      const teamMember = await storage.getTeamMember(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.json(teamMember);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team member" });
    }
  });

  app.post("/api/team-members", async (req, res) => {
    try {
      const { roleName, ...teamMemberData } = req.body;
      
      // Get role ID from role name
      let roleId: string;
      if (roleName) {
        const role = await storage.getRoleByName(roleName);
        if (!role) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        roleId = role.id;
      } else {
        return res.status(400).json({ error: "Role name is required" });
      }

      // Create team member with role ID
      const teamMember = await storage.createTeamMember({
        ...teamMemberData,
        roleId
      });
      res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ error: "Invalid team member data" });
    }
  });

  app.put("/api/team-members/:id", async (req, res) => {
    try {
      const { roleName, ...teamMemberData } = req.body;
      // Get the current team member before update
      const prevTeamMember = await storage.getTeamMember(req.params.id);
      const prevFullName = prevTeamMember?.fullName;
      // Get role ID from role name if provided
      if (roleName) {
        const role = await storage.getRoleByName(roleName);
        if (!role) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        teamMemberData.roleId = role.id;
      }
      const teamMember = await storage.updateTeamMember(req.params.id, teamMemberData);
      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      // --- Enhanced Logging and Always Emit permissions-updated ---
      const io = req.app.get('io') || (req.app as any).io;
      const userSocketMap = (global as any).userSocketMap || (req.app as any).userSocketMap;
      const memberId = teamMember.fullName;
      console.log(teamMember.fullName,"teamMember.fullName");
      console.log('Update request body:', req.body);
      console.log('userSocketMap:', Array.from(userSocketMap?.entries?.() || []));
      if (io && userSocketMap && memberId) {
        const socketId = userSocketMap.get(memberId);
        if (socketId) {
          io.to(socketId).emit('permissions-updated');
          console.log(`Emitted permissions-updated to ${memberId} (${socketId})`);
        } else {
          console.log(`No socketId found for memberId: ${memberId}`);
        }
      } else {
        if (!io) console.log('Socket.io instance not found');
        if (!userSocketMap) console.log('userSocketMap not found');
        if (!memberId) console.log('memberId not found');
      }
      // --- End Enhanced Logging ---
      // --- Update chats if fullName changed ---
      if (prevFullName && teamMember.fullName && prevFullName !== teamMember.fullName) {
        const allChats = await storage.getChats();
        for (const chat of allChats) {
          if (Array.isArray(chat.participants) && chat.participants.includes(prevFullName)) {
            const updatedParticipants = chat.participants.map(p => p === prevFullName ? teamMember.fullName : p);
            await storage.updateChat(chat.id, { participants: updatedParticipants });
            // Emit socket event for updated participants
            if (io) {
              io.emit('participants-updated', {
                chatId: chat.id,
                participants: updatedParticipants,
                newParticipants: [teamMember.fullName],
                removedParticipants: [prevFullName],
                updatedBy: 'System'
              });
              console.log(`Updated participants for chat ${chat.id} after name change:`, updatedParticipants);
            }
          }
        }
      }
      // --- End chat update logic ---
      res.json(teamMember);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(400).json({ error: "Invalid team member data" });
    }
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    try {
      // Get the member before deletion
      const member = await storage.getTeamMember(req.params.id);
      const fullName = member?.fullName;
      // Get all chats before deletion
      let affectedChats: { id: string; participants: string[] | null }[] = [];
      let allChats: { id: string; participants: string[] | null }[] = [];
      if (fullName) {
        allChats = await storage.getChats();
        affectedChats = allChats.filter(chat => Array.isArray(chat.participants) && chat.participants.includes(fullName));
      }
      await storage.deleteTeamMember(req.params.id);
      // Emit socket event for each affected chat
      const io = req.app.get('io') || (req.app as any).io;
      if (io && fullName) {
        for (const chat of affectedChats) {
          const updatedParticipants = (chat.participants || []).filter((p: string) => p !== fullName);
          io.emit('participants-updated', {
            chatId: chat.id,
            participants: updatedParticipants,
            newParticipants: [],
            removedParticipants: [fullName],
            updatedBy: 'System'
          });
        }
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });

  // Get team member by mobile number
  app.get("/api/team-members/mobile/:mobileNumber", async (req, res) => {
    try {
      const { mobileNumber } = req.params;
      console.log('Finding team member by mobile number:', mobileNumber);
      
      const teamMember = await storage.getTeamMemberByMobileNumber(mobileNumber);
      
      if (!teamMember) {
        return res.status(404).json({ message: 'Team member not found' });
      }
      
      console.log('Team member found:', teamMember);
      res.json(teamMember);
    } catch (error) {
      console.error('Error finding team member by mobile number:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get clinic by mobile number
  app.get("/api/clinics/mobile/:mobileNumber", async (req, res) => {
    try {
      const { mobileNumber } = req.params;
      console.log('Finding clinic by mobile number:', mobileNumber);
      
      const clinic = await storage.getClinicByMobileNumber(mobileNumber);
      
      if (!clinic) {
        return res.status(404).json({ message: 'Clinic not found' });
      }
      
      console.log('Clinic found:', clinic);
      res.json(clinic);
    } catch (error) {
      console.error('Error finding clinic by mobile number:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Chat API
  app.get("/api/chats", async (req, res) => {
    try {
      const { userId } = req.query;
      const chats = await storage.getChats();
      console.log("chats", chats);
      console.log("userId from query:", userId);
      
      // If userId is provided, calculate unread count for each chat
      if (userId && typeof userId === 'string') {
        console.log(`Calculating unread counts for user: ${userId}`);
        const chatsWithUnreadCount = await Promise.all(
          chats.map(async (chat) => {
            console.log(`Processing chat ${chat.title} (${chat.id}) with participants:`, chat.participants);
            
            // Check if user is a participant in this chat
            const participants = chat.participants || [];
            const isParticipant = participants.some((participant) => {
              const exactMatch = participant.toLowerCase() === userId.toLowerCase();
              const containsMatch = participant.toLowerCase().includes(userId.toLowerCase()) ||
                                   userId.toLowerCase().includes(participant.toLowerCase());
              return exactMatch || containsMatch;
            });
            
            console.log(`User ${userId} isParticipant in chat ${chat.title}: ${isParticipant}`);
            
            if (!isParticipant) {
              // Exclude this chat from the result
              return null;
            }
            const unreadCount = await storage.getUnreadMessageCount(chat.id, userId);
            console.log(`Chat ${chat.title} (${chat.id}): ${unreadCount} unread messages for user ${userId}`);
            return {
              ...chat,
              unreadCount
            };
          })
        );
        // Filter out nulls (chats where user is not a participant)
        const filteredChats = chatsWithUnreadCount.filter(Boolean);
        console.log("Final chats with unread counts:", filteredChats);
        res.json(filteredChats);
      } else {
        console.log("No userId provided, returning chats without unread counts");
        res.json(chats);
      }
    } catch (error) {
      console.log("Error fetching chats", error);
      res.status(500).json({ error: "Failed to fetch chats" });
    }
  });

  app.get("/api/chats/:id", async (req, res) => {
    try {
      console.log("Fetching chat", req.params.id);
      const chat = await storage.getChat(req.params.id);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      console.log("Error fetching chat", error);
      res.status(500).json({ error: "Failed to fetch chat" });
    }
  });

  app.get("/api/chats/type/:type", async (req, res) => {
    try {
      const chats = await storage.getChatsByType(req.params.type);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chats by type" });
    }
  });

  app.post("/api/chats", async (req, res) => {
    try {
      if (!req.body.clinicId) {
        return res.status(400).json({ error: "clinicId is required" });
      }
      const chatData = insertChatSchema.parse(req.body);
      const chat = await storage.createChat(chatData);
      res.status(201).json(chat);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Invalid chat data" });
    }
  });

  app.get("/api/chats/:id/messages", async (req, res) => {
    try {
      // Never send 304, always send 200 with latest messages
      const messages = await storage.getMessagesByChat(req.params.id);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chats/:id/messages", async (req, res) => {
    try {
      console.log("req.body", req.body);
      const messageData = insertMessageSchema.parse({
        ...req.body,
        chatId: req.params.id // use as string
      });
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  });

  app.post("/api/chats/:id/mark-read", async (req, res) => {
    try {
      const { userId } = req.body;
      const chatId = req.params.id; // use as string
      await storage.markAllMessagesAsRead(chatId, userId);
      // Emit unread-count-update to this user
      const io = req.app.get('io') || (req.app as any).io;
      const userSocketMap = req.app.get('userSocketMap') || (req.app as any).userSocketMap;
      if (io && userSocketMap && userId) {
        const socketId = userSocketMap.get(userId);
        if (socketId) {
          const unreadCount = await storage.getUnreadMessageCount(chatId, userId);
          io.to(socketId).emit('unread-count-update', { chatId, unreadCount });
        }
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  app.delete("/api/chats/:id", async (req, res) => {
    try {
      const chatId = req.params.id;
      const chat = await storage.getChat(chatId);
      
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      // Only allow deletion of chats created by the current user (not order-wise chats)
      // if (chat.orderId) {
      //   return res.status(403).json({ error: "Cannot delete order-wise chats" });
      // }

      // Delete messages first, then chat
      const messages = await storage.getMessagesByChat(chatId);
      for (const message of messages) {
        // Delete messages (implement deleteMessage in storage if needed)
      }
      
      await storage.updateChat(chatId, { isActive: false });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete chat" });
    }
  });

  app.patch("/api/chats/:id/archive", async (req, res) => {
    try {
      const chatId = req.params.id;
      const chat = await storage.updateChat(chatId, { isActive: false });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to archive chat" });
    }
  });

  app.patch("/api/chats/:id/participants", async (req, res) => {
    try {
      const chatId = req.params.id;
      const { participants } = req.body;
      
      if (!Array.isArray(participants)) {
        return res.status(400).json({ error: "Participants must be an array" });
      }

      // Get current chat to compare participants
      const currentChat = await storage.getChat(chatId);
      const currentParticipants = currentChat?.participants || [];
      
      // Find newly added participants
      const newParticipants = participants.filter(p => !currentParticipants.includes(p));
      const removedParticipants = currentParticipants.filter(p => !participants.includes(p));

      const chat = await storage.updateChat(chatId, { participants });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      // Emit Socket.IO event to notify all connected users about participant change
      const io = (req.app as any).io;
      if (io) {
        io.emit('participants-updated', {
          chatId: chatId,
          participants: participants,
          newParticipants: newParticipants,
          removedParticipants: removedParticipants,
          updatedBy: req.body.updatedBy || 'Unknown'
        });
        console.log(`Participants updated for chat ${chatId}, broadcasting to all users`);
      }

      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to update participants" });
    }
  });

  // Orders API
  app.post("/api/orders/create", async (req, res) => {
    try {
      // Validate request body
      const orderData = req.body;
      
      if (!orderData.patient || !orderData.doctor) {
        return res.status(400).json({ error: "Patient and doctor information are required" });
      }

      // Create patient first
      const patient = await storage.createPatient({
        firstName: orderData.patient.firstName,
        lastName: orderData.patient.lastName,
        age: orderData.patient.age,
        sex: orderData.patient.sex
      });

      // Create order with basic fields that match the schema
      const order = await storage.createOrder({
        orderId: orderData.orderId || `ADL-${Date.now()}`,
        patientId: patient.id,
        category: orderData.category,
        type: orderData.restorationType || orderData.orderType,
        notes: orderData.notes,
        status: orderData.status || "pending",
      });

      // Create tooth groups if provided
      if (orderData.toothGroups && orderData.toothGroups.length > 0) {
        for (const group of orderData.toothGroups) {
          await storage.createToothGroup({
            orderId: order.id,
            groupId: group.groupId,
            teeth: Array.isArray(group.teeth) ? group.teeth : [],
            type: group.type,
            material: group.material,
            shade: group.shade,
            notes: group.notes
          });
        }
      }

      // Create scan booking if provided
      if (orderData.scanBooking) {
        await storage.createScanBooking({
          orderId: order.id,
          areaManagerId: orderData.scanBooking.areaManagerId,
          scanDate: orderData.scanBooking.scanDate,
          scanTime: orderData.scanBooking.scanTime,
          notes: orderData.scanBooking.notes
        });
      }

      res.status(201).json({ order, patient });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { mobileNumber, password } = req.body;
      if (!mobileNumber || !password) {
        return res.status(400).json({ error: "Mobile number and password are required" });
      }

      // Try team member first
      const teamMember = await storage.getTeamMemberByMobileNumber(mobileNumber);
      if (teamMember) {
        if (teamMember.password === password) {
          // Get roleName from role table
          let roleName = '';
          if (teamMember.roleId) {
            const role = await storage.getRoleById(teamMember.roleId);
            roleName = role?.name || '';
          }
          // Get clinicId from clinic table
          let clinicId = '';
          if (teamMember.clinicName) {
            const clinic = await storage.getClinicByName(teamMember.clinicName);
            clinicId = clinic?.id || '';
          }
          return res.json({
            ...teamMember,
            userType: "teamMember",
            roleName,
            clinicId,
          });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }

      // Try clinic
      const clinic = await storage.getClinicByMobileNumber(mobileNumber);
      if (clinic) {
        if (clinic.password === password) {
          // Get roleName from role table
          let roleName = '';
          if (clinic.roleId) {
            const role = await storage.getRoleById(clinic.roleId);
            roleName = role?.name || '';
          }
          return res.json({
            ...clinic,
            userType: "clinic",
            roleName,
            clinicId: clinic.id,
          });
        } else {
          return res.status(401).json({ error: "Invalid password" });
        }
      }

      // Not found
      return res.status(401).json({ error: "User not found" });
    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { mobileNumber, password } = req.body;
      const newUser = await storage.createUser({
        mobileNumber,
        password, // Note: Password should be hashed
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  });

  app.post("/api/clinic/register", async (req, res) => {
    try {
      const clinicData = insertClinicSchema.parse(req.body);
      // Check if clinic with this email already exists
      const existingClinic = await storage.getClinicByEmail(clinicData.email);
      if (existingClinic) {
        return res.status(400).json({ error: "Clinic with this email already exists" });
      }
      // Set default permissions for new clinics
      const defaultPermissions = [
        "scan_booking",
        "tracking",
        "pickup_requests",
        "chat",
        "all_patients",
        "billing"
      ];
      const clinicRoleId = '2411f233-1e48-43ae-9af9-6d5ce0569278';
      const newClinic = await storage.createClinic({
        ...clinicData,
        roleId: clinicRoleId,
        permissions: defaultPermissions
      });
      // Fetch role name for the clinic roleId
      let roleName = '';
      try {
        const role = await storage.getRoleById(clinicRoleId);
        roleName = role?.name || '';
      } catch (error) {
        console.log('Failed to fetch role name for clinic:', error);
      }
      res.status(201).json({
        message: "Clinic registered successfully",
        clinic: {
          id: newClinic.id,
          firstname: newClinic.firstname,
          lastname: newClinic.lastname,
          email: newClinic.email,
          clinicName: newClinic.clinicName,
          permissions: newClinic.permissions,
          roleId: newClinic.roleId,
          roleName: roleName
        }
      });
    } catch (error) {
      console.error("Clinic registration error:", error);
      res.status(400).json({ 
        error: "Invalid clinic data",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post("/api/clinic/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find clinic by email
      const clinic = await storage.getClinicByEmail(email);
      if (!clinic) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password (in a real app, you'd hash and compare passwords)
      if (clinic.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Return clinic data (excluding password)
      res.json({
        id: clinic.id,
        firstname: clinic.firstname,
        lastname: clinic.lastname,
        email: clinic.email,
        phone: clinic.phone,
        clinicName: clinic.clinicName,
        roleId: clinic.roleId,
        permissions: clinic.permissions
      });
    } catch (error) {
      console.error("Clinic login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logout successful" });
    });
  });

  app.get('/api/me', async (req, res) => {
    try {
      const mobileNumber = req.headers['x-mobile-number'];
      if (!mobileNumber || typeof mobileNumber !== 'string') {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      // First try to find team member
      let teamMember = await storage.getTeamMemberByMobileNumber(mobileNumber);
      let clinic = null;
      let userType = 'teamMember';
      // If team member not found, try to find clinic
      if (!teamMember) {
        clinic = await storage.getClinicByMobileNumber(mobileNumber);
        userType = 'clinic';
      }
      if (!teamMember && !clinic) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Get role name if roleId exists
      let roleName = '';
      const roleId = teamMember?.roleId || clinic?.roleId;
      if (roleId) {
        try {
          const role = await storage.getRoleById(roleId);
          roleName = role?.name || '';
        } catch (error) {
          console.log('Failed to fetch role name:', error);
        }
      }
      // Return only essential user data, excluding sensitive information
      const essentialUserData = {
        id: userType === 'clinic' ? clinic!.id : teamMember!.id,
        fullName: userType === 'clinic' ? `${clinic!.firstname} ${clinic!.lastname}` : teamMember!.fullName,
        permissions: (userType === 'clinic' ? clinic!.permissions : teamMember!.permissions) || [],
        contactNumber: userType === 'clinic' ? clinic!.phone : teamMember!.contactNumber,
        roleId: roleId || '',
        clinicName: (userType === 'clinic' ? clinic!.clinicName : teamMember!.clinicName) || '',
        roleName: roleName,
        userType: userType,
        clinicId: userType === 'clinic' ? clinic!.id : ''
      };
      res.json(essentialUserData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });

  // Get role name by role id
  app.get("/api/roles/:roleId", async (req, res) => {
    try {
      const { roleId } = req.params;
      const role = await storage.getRoleById(roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json({ id: role.id, name: role.name });
    } catch (error) {
      console.error('Error fetching role by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get role id by role name
  app.get("/api/roles/name/:roleName", async (req, res) => {
    try {
      const { roleName } = req.params;
      const role = await storage.getRoleByName(roleName);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json({ id: role.id, name: role.name });
    } catch (error) {
      console.error('Error fetching role by name:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get clinic name by clinic id
  app.get("/api/clinics/:id/name", async (req, res) => {
    try {
      const { id } = req.params;
      const clinic = await storage.getClinic(id);
      if (!clinic) {
        return res.status(404).json({ error: 'Clinic not found' });
      }
      res.json({ id: clinic.id, clinicName: clinic.clinicName });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get clinic by clinic name
  app.get("/api/clinics/name/:clinicName", async (req, res) => {
    try {
      const { clinicName } = req.params;
      const clinics = await storage.getClinics();
      const clinic = clinics.find(c => c.clinicName === clinicName);
      if (!clinic) {
        return res.status(404).json({ error: 'Clinic not found' });
      }
      res.json({ id: clinic.id, clinicName: clinic.clinicName });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Lifecycle Stages API
  app.get('/api/lifecycle-stages', async (req, res) => {
    try {
      const stages = await storage.getLifecycleStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lifecycle stages' });
    }
  });

  // Get chat by orderId
  app.get('/api/orders/:orderId/chat', async (req, res) => {
    try {
      const chat = await storage.getChatByOrderId(req.params.orderId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found for this order' });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat for order' });
    }
  });

  // Get user data by ID - handles both clinic and team member
  app.get('/api/userData/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('getUserData API called with ID:', id);
      
      // First try to find clinic (main_doctor)
      let clinic = await storage.getClinic(id);
      console.log('Clinic lookup result:', clinic ? 'Found' : 'Not found');
      
      if (clinic) {
        console.log('Processing clinic data for:', clinic.firstname, clinic.lastname);
        // Get role name
        let roleName = '';
        if (clinic.roleId) {
          try {
            const role = await storage.getRoleById(clinic.roleId);
            roleName = role?.name || '';
            console.log('Role name for clinic:', roleName);
          } catch (error) {
            console.log('Failed to fetch role name:', error);
          }
        }

        // Parse clinic address and billing info
        let clinicAddress: any = {};
        let billingInfo: any = {};
        
        try {
          if (clinic.clinicAddress) {
            clinicAddress = JSON.parse(clinic);
          }
        } catch (e) {
          clinicAddress = { address: clinic || '' };
        }
        
        try {
          if (clinic.billingInfo) {
            billingInfo = JSON.parse(clinic.billingInfo);
          }
        } catch (e) {
          billingInfo = {};
        }

        console.log('Clinic', clinic);

        const userData = {
          id: clinic.id,
          firstName: clinic.firstname,
          lastName: clinic.lastname,
          email: clinic.email,
          phone: clinic.phone,
          clinicName: clinic.clinicName,
          licenseNumber: clinic.clinicLicenseNumber,
          clinicAddress: clinic.clinicAddress || '',
          billingAddress: clinic.billingInfo || '',
          gstNumber: clinic.gstNumber || '',
          panNumber: clinic.panNumber || '',
          roleName: roleName,
          userType: 'clinic',
          permissions: clinic.permissions || []
        };
        
        console.log('Returning clinic user data');
        return res.json(userData);
      }

      // If not found in clinic table, try team member table
      let teamMember = await storage.getTeamMember(id);
      console.log('Team member lookup result:', teamMember ? 'Found' : 'Not found');
      
      if (teamMember) {
        console.log('Processing team member data for:', teamMember.fullName);
        // Get role name
        let roleName = '';
        if (teamMember.roleId) {
          try {
            const role = await storage.getRoleById(teamMember.roleId);
            roleName = role?.name || '';
            console.log('Role name for team member:', roleName);
          } catch (error) {
            console.log('Failed to fetch role name:', error);
          }
        }

        const userData = {
          id: teamMember.id,
          firstName: teamMember.fullName.split(' ')[0] || '',
          lastName: teamMember.fullName.split(' ').slice(1).join(' ') || '',
          email: teamMember.email,
          phone: teamMember.contactNumber,
          clinicName: teamMember.clinicName,
          licenseNumber: '',
          clinicAddressLine1: '',
          clinicAddressLine2: '',
          clinicCity: '',
          clinicState: '',
          clinicPincode: '',
          clinicCountry: 'India',
          billingAddressLine1: '',
          billingAddressLine2: '',
          billingCity: '',
          billingState: '',
          billingPincode: '',
          billingCountry: 'India',
          gstNumber: '',
          panNumber: '',
          roleName: roleName,
          userType: 'teamMember',
          permissions: teamMember.permissions || []
        };
        
        console.log('Returning team member user data');
        return res.json(userData);
      }

      // If not found in either table
      console.log('User not found in either clinic or team member tables');
      return res.status(404).json({ error: 'User not found' });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}



