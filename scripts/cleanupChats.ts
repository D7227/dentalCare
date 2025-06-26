
import { db } from '../server/db';
import { chats } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function cleanupDuplicateChats() {
  console.log('Cleaning up duplicate master chats...');
  
  // Get all master chats
  const masterChats = await db.select().from(chats).where(eq(chats.type, 'master'));
  
  console.log(`Found ${masterChats.length} master chats`);
  
  if (masterChats.length > 1) {
    // Keep the first one, deactivate the rest
    const keepChat = masterChats[0];
    const duplicatesToRemove = masterChats.slice(1);
    
    console.log(`Keeping master chat with ID: ${keepChat.id}`);
    console.log(`Deactivating ${duplicatesToRemove.length} duplicate master chats`);
    
    for (const duplicate of duplicatesToRemove) {
      await db.update(chats)
        .set({ isActive: false })
        .where(eq(chats.id, duplicate.id));
      console.log(`Deactivated duplicate master chat with ID: ${duplicate.id}`);
    }
    
    console.log('Cleanup completed successfully');
  } else {
    console.log('No duplicate master chats found');
  }
}

cleanupDuplicateChats().catch(console.error);
