import type { Express } from "express";
import { teamMemberStorage } from "./teamMemberController";
import { RolesStorage } from "../role/roleController";
import { chatStorage } from "../chat/chatController";
import { clinicStorage } from "../clinic/clinicController";
import bcrypt from "bcrypt";

export const setupTeamMemberRoutes = (app: Express) => {
  app.get("/api/team-members/:clinicId", async (req, res) => {
    try {
      // const { clinicName } = req.query;
      const clinicId = req.params.clinicId;

      const clinicName = await clinicStorage.getClinicById(clinicId);
      const teamMemberData = await teamMemberStorage.getTeamMembersByClinic(clinicName.clinicName)

      return res.json(teamMemberData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.get("/api/team-member/:id", async (req, res) => {
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

  app.post("/api/create/team-members", async (req, res) => {
    try {
      const { roleName, ...teamMemberData } = req.body;
      // Check if mobile number already exists in team-member table
      const existingTeamMemberByMobile =
        await teamMemberStorage.getTeamMemberByMobileNumber(
          teamMemberData.contactNumber
        );
      if (existingTeamMemberByMobile) {
        return res
          .status(400)
          .json({ error: "Mobile number is already in use by a team member" });
      }
      // Check if mobile number already exists in clinic table
      const existingClinicByMobile =
        await clinicStorage.getClinicByMobileNumber(
          teamMemberData.contactNumber
        );
      if (existingClinicByMobile) {
        return res
          .status(400)
          .json({ error: "Mobile number is already in use by a clinic" });
      }
      // Get role ID from role name
      let roleId: string;
      if (roleName) {
        const role = await RolesStorage.getRoleByName(roleName);
        if (!role) {
          return res
            .status(400)
            .json({ error: `Role '${roleName}' not found` });
        }
        roleId = role.id;
      } else {
        return res.status(400).json({ error: "Role name is required" });
      }
      // Hash the password before saving
      let teamMemberToSave = { ...teamMemberData, roleId };
      if (teamMemberToSave.password) {
        teamMemberToSave.password = await bcrypt.hash(teamMemberToSave.password, 10);
      }
      // Create team member with role ID
      const teamMember = await teamMemberStorage.createTeamMember(teamMemberToSave);
      res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(400).json({ error: "Invalid team member data" });
    }
  });

  app.delete("/api/team-member/:id", async (req, res) => {
    try {
      // Get the member before deletion
      const member = await teamMemberStorage.getTeamMember(req.params.id);
      const fullName = member?.fullName;
      // Get all chats before deletion
      let affectedChats: { id: string; participants: string[] | null }[] = [];
      let allChats: { id: string; participants: string[] | null }[] = [];
      if (fullName) {
        allChats = await chatStorage.getChats();
        affectedChats = allChats.filter(
          (chat) =>
            Array.isArray(chat.participants) &&
            chat.participants.includes(fullName)
        );
      }
      await teamMemberStorage.deleteTeamMember(req.params.id);
      // Emit socket event for each affected chat
      const io = req.app.get("io") || (req.app as any).io;
      if (io && fullName) {
        for (const chat of affectedChats) {
          const updatedParticipants = (chat.participants || []).filter(
            (p: string) => p !== fullName
          );
          io.emit("participants-updated", {
            chatId: chat.id,
            participants: updatedParticipants,
            newParticipants: [],
            removedParticipants: [fullName],
            updatedBy: "System",
          });
        }
      }
      res.status(200).send({message :"team member delete successfully"});
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  })
}