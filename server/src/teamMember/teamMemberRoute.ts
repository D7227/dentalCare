import type { Express } from "express";
import { teamMemberStorage } from "./teamMemberController";
import { RolesStorage } from "../role/roleController";
import { chatStorage } from "../chat/chatController";
import { clinicStorage } from "../clinic/clinicController";


export default function setupTeamMemberRoutes(app: Express) {  
app.get("/api/team-members", async (req, res) => {
    try {
      const { clinicName } = req.query;
      
      if (clinicName && typeof clinicName === 'string') {
        // Return team members filtered by clinic name
        const teamMembers = await teamMemberStorage.getTeamMembersByClinic(clinicName);
        
        // Add roleName to each team member
        const teamMembersWithRoleName = await Promise.all(
          teamMembers.map(async (member) => {
            let roleName = '';
            if (member.roleId) {
              const role = await RolesStorage.getRoleById(member.roleId);
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
        const teamMembers = await teamMemberStorage.getTeamMembers();
        
        // Add roleName to each team member
        const teamMembersWithRoleName = await Promise.all(
          teamMembers.map(async (member) => {
            let roleName = '';
            if (member.roleId) {
              const role = await RolesStorage.getRoleById(member.roleId);
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
      const teamMember = await teamMemberStorage.getTeamMember(req.params.id);
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
      // Check if mobile number already exists in team-member table
      const existingTeamMemberByMobile = await teamMemberStorage.getTeamMemberByMobileNumber(teamMemberData.contactNumber);
      if (existingTeamMemberByMobile) {
        return res.status(400).json({ error: "Mobile number is already in use by a team member" });
      }
      // Check if mobile number already exists in clinic table
      const existingClinicByMobile = await clinicStorage.getClinicByMobileNumber(teamMemberData.contactNumber);
      if (existingClinicByMobile) {
        return res.status(400).json({ error: "Mobile number is already in use by a clinic" });
      }
      // Get role ID from role name
      let roleId: string;
      if (roleName) {
        const role = await RolesStorage.getRoleByName(roleName);
        if (!role) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        roleId = role.id;
      } else {
        return res.status(400).json({ error: "Role name is required" });
      }
      // Create team member with role ID
      const teamMember = await teamMemberStorage.createTeamMember({
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
      const prevTeamMember = await teamMemberStorage.getTeamMember(req.params.id);
      const prevFullName = prevTeamMember?.fullName;
      // Get role ID from role name if provided
      if (roleName) {
        const role = await RolesStorage.getRoleByName(roleName);
        if (!role) {
          return res.status(400).json({ error: `Role '${roleName}' not found` });
        }
        teamMemberData.roleId = role.id;
      }
      const teamMember = await teamMemberStorage.updateTeamMember(req.params.id, teamMemberData);
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
        const allChats = await chatStorage.getChats();
        for (const chat of allChats) {
          if (Array.isArray(chat.participants) && chat.participants.includes(prevFullName)) {
            const updatedParticipants = chat.participants.map(p => p === prevFullName ? teamMember.fullName : p);
            await chatStorage.updateChat(chat.id, { participants: updatedParticipants });
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
      const member = await teamMemberStorage.getTeamMember(req.params.id);
      const fullName = member?.fullName;
      // Get all chats before deletion
      let affectedChats: { id: string; participants: string[] | null }[] = [];
      let allChats: { id: string; participants: string[] | null }[] = [];
      if (fullName) {
        allChats = await chatStorage.getChats();
        affectedChats = allChats.filter(chat => Array.isArray(chat.participants) && chat.participants.includes(fullName));
      }
      await teamMemberStorage.deleteTeamMember(req.params.id);
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
      
      const teamMember = await teamMemberStorage.getTeamMemberByMobileNumber(mobileNumber);
      
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
}