import { lifecycleStages } from "./lifeCycleSchema";
import { db } from "../../database/db";


export interface LifeCycleStorage {
    getLifecycleStages(): Promise<any[]>;
}

export class LifeCycleStorage implements LifeCycleStorage {

    async getLifecycleStages(): Promise<any[]> {
        return await db.select().from(lifecycleStages).orderBy(lifecycleStages.createdAt);
      }
}


export const lifeCycleStorage = new LifeCycleStorage();