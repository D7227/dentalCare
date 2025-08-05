import { eq, and, or, sql, gte, lte, inArray } from "drizzle-orm";
import { db } from "../../database/db";
import { role } from "./roleSchema";

export interface RoleStore {
  // Role methods
  getRoleById(roleId: string): Promise<{ id: string, name: string } | undefined>;
  getRoleByName(roleName: string): Promise<{ id: string, name: string } | undefined>;
}

export class RoleStorage implements RoleStore {

async getRoleById(roleId: string): Promise<{ id: string, name: string } | undefined> {
    const [roleData] = await db.select().from(role).where(eq(role.id, roleId));
    return roleData;
  }

  async getRoleByName(roleName: string): Promise<{ id: string, name: string } | undefined> {
    const [roleData] = await db.select().from(role).where(eq(role.name, roleName));
    return roleData;
  }
}

export const RolesStorage = new RoleStorage();