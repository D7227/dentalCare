
import type { Express } from "express";
import { RolesStorage } from "./roleController";


export default function setuRoleRoutes(app: Express) {  
app.get("/api/roles/:roleId", async (req, res) => {
    try {
      const { roleId } = req.params;
      const role = await RolesStorage.getRoleById(roleId);
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
      const role = await RolesStorage.getRoleByName(roleName);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json({ id: role.id, name: role.name });
    } catch (error) {
      console.error('Error fetching role by name:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}