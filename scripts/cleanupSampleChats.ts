import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function cleanupSampleChats() {
  try {
    console.log('🧹 Cleaning up sample chats with hardcoded participants...');
    
    // Step 1: Delete all existing chats and messages
    console.log('📝 Step 1: Deleting all existing chats and messages...');
    await db.execute(sql`DELETE FROM messages`);
    await db.execute(sql`DELETE FROM chats`);
    console.log('✅ All existing chats and messages deleted');
    
    // Step 2: Create a clean master chat with only the main doctor
    console.log('📝 Step 2: Creating a clean master chat...');
    
    const cleanMasterChat = {
      type: 'master',
      title: 'Master Group',
      participants: ['Dr. Sarah Mitchell'], // Only the main doctor
      createdBy: 'Dr. Sarah Mitchell',
      clinicId: '550e8400-e29b-41d4-a716-446655440000',
      isActive: true
    };
    
    await db.execute(sql`
      INSERT INTO chats (type, title, participants, created_by, clinic_id, is_active)
      VALUES (${cleanMasterChat.type}, ${cleanMasterChat.title}, ${JSON.stringify(cleanMasterChat.participants)}, ${cleanMasterChat.createdBy}, ${cleanMasterChat.clinicId}, ${cleanMasterChat.isActive})
    `);
    
    console.log('✅ Clean master chat created with only Dr. Sarah Mitchell as participant');
    
    // Step 3: Create a welcome message that's already read
    console.log('📝 Step 3: Creating a welcome message...');
    
    const chatResult = await db.execute(sql`
      SELECT id FROM chats WHERE type = 'master' LIMIT 1
    `);
    
    if (chatResult.rows.length > 0) {
      const chatId = chatResult.rows[0].id;
      
      const welcomeMessage = {
        chatId: chatId,
        sender: 'Dr. Sarah Mitchell',
        senderRole: 'main_doctor',
        senderType: 'clinic',
        content: 'Welcome to the master group! Team members will be added here as needed.',
        messageType: 'text',
        readBy: ['Dr. Sarah Mitchell'] // Already read
      };
      
      await db.execute(sql`
        INSERT INTO messages (chat_id, sender, sender_role, sender_type, content, message_type, read_by)
        VALUES (${welcomeMessage.chatId}, ${welcomeMessage.sender}, ${welcomeMessage.senderRole}, ${welcomeMessage.senderType}, ${welcomeMessage.content}, ${welcomeMessage.messageType}, ${JSON.stringify(welcomeMessage.readBy)})
      `);
      
      console.log('✅ Welcome message created and marked as read');
    }
    
    // Step 4: Verify the cleanup
    console.log('📝 Step 4: Verifying cleanup...');
    
    const chatCount = await db.execute(sql`SELECT COUNT(*) as count FROM chats`);
    console.log(`📊 Total chats in database: ${chatCount.rows[0].count}`);
    
    const messageCount = await db.execute(sql`SELECT COUNT(*) as count FROM messages`);
    console.log(`📊 Total messages in database: ${messageCount.rows[0].count}`);
    
    const remainingChats = await db.execute(sql`
      SELECT type, title, participants, created_by, is_active 
      FROM chats 
      ORDER BY type
    `);
    console.log('Remaining chats:');
    remainingChats.rows.forEach((chat: any) => {
      console.log(`  - ${chat.title} (${chat.type}): Created by ${chat.created_by}, Active: ${chat.is_active}, Participants: [${chat.participants.join(', ')}]`);
    });
    
    console.log('\n✅ Sample chat cleanup completed successfully!');
    console.log('💡 Now team members will only see unread counts for chats they are explicitly added to.');
    console.log('   - Only Dr. Sarah Mitchell is a participant in the master chat');
    console.log('   - New team members will not see any unread counts until added to chats');
    
  } catch (error) {
    console.error('❌ Error cleaning up sample chats:', error);
  } finally {
    process.exit(0);
  }
}

cleanupSampleChats(); 