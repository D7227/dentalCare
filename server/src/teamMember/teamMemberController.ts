import { eq, asc, desc } from "drizzle-orm";
import { db } from "../../database/db";
import { teamMembers, InsertTeamMember, TeamMember } from "./teamMemberschema";

export interface TeamMemberStorage {
getTeamMember(id: string): Promise<TeamMember | undefined>;
createTeamMember(data: InsertTeamMember): Promise<TeamMember>;
getTeamMembers(): Promise<TeamMember[]>;
getTeamMembersByClinic(clinicName: string): Promise<TeamMember[]>;
updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
deleteTeamMember(id: string): Promise<void>;
getTeamMemberByMobileNumber(mobileNumber: string): Promise<TeamMember | undefined>;
getTeamMemberById(fullName: string): Promise<TeamMember | undefined>;
}

export class TeamMemberStorage implements TeamMemberStorage {
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
    
      async deleteTeamMember(id: string): Promise<void> {
        await db.delete(teamMembers).where(eq(teamMembers.id, id));
      }
    
      async getTeamMemberByMobileNumber(mobileNumber: string): Promise<TeamMember | undefined> {
        const [teamMember] = await db
          .select()
          .from(teamMembers)
          .where(eq(teamMembers.contactNumber, mobileNumber));
        return teamMember;
      }
    
      async getTeamMemberById(id: string): Promise<TeamMember | undefined> {
        const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
        return member;
      }
}

export const teamMemberStorage = new TeamMemberStorage();