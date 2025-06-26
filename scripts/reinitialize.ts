
import { db } from '../server/db';
import { storage } from '../server/storage';

async function reinitializeDatabase() {
  console.log('Reinitializing database...');
  
  try {
    // Clear existing data
    await db.delete(require('../shared/schema').messages);
    await db.delete(require('../shared/schema').chats);
    await db.delete(require('../shared/schema').bills);
    await db.delete(require('../shared/schema').pickupRequests);
    await db.delete(require('../shared/schema').scanBookings);
    await db.delete(require('../shared/schema').toothGroups);
    await db.delete(require('../shared/schema').orders);
    await db.delete(require('../shared/schema').patients);
    
    console.log('Cleared existing data');
    
    // Reinitialize with sample data
    await storage.initializeData();
    
    console.log('Database reinitialized successfully');
  } catch (error) {
    console.error('Error reinitializing database:', error);
  }
}

reinitializeDatabase();
