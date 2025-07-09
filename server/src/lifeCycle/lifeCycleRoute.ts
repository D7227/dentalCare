import type { Express } from "express";
import { lifeCycleStorage } from "./lifeCycleController";


export default async function setupLifeCycleRoutes(app: Express) {

app.get('/api/lifecycle-stages', async (req, res) => {
    try {
      const stages = await lifeCycleStorage.getLifecycleStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lifecycle stages' });
    }
  });
}