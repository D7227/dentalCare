import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function createSampleMessages() {
  try {
    console.log('📝 Creating sample messages...');
    
    // Get the first chat ID
    const chatResult = await db.execute(sql`
      SELECT id FROM chats LIMIT 1
    `);
    
    if (chatResult.rows.length === 0) {
      console.log('❌ No chats found. Please run the addCreatedByToChats script first.');
      return;
    }
    
    const chatId = chatResult.rows[0].id;
    console.log(`Using chat ID: ${chatId}`);
    
    // Create sample messages
    const messages = [
      {
        chatId: chatId,
        sender: 'Dr. Sarah Mitchell',
        senderRole: 'main_doctor',
        senderType: 'clinic',
        content: 'Hello team! How is everyone doing today?',
        messageType: 'text',
        readBy: ['Dr. Sarah Mitchell']
      },
      {
        chatId: chatId,
        sender: 'Dr. John Smith',
        senderRole: 'assistant_doctor',
        senderType: 'clinic',
        content: 'Hi Dr. Sarah! Everything is going well. I have a question about the new patient case.',
        messageType: 'text',
        readBy: ['Dr. Sarah Mitchell', 'Dr. John Smith']
      },
      {
        chatId: chatId,
        sender: 'Alice Johnson',
        senderRole: 'receptionist',
        senderType: 'clinic',
        content: 'Good morning! I have some updates about the appointment schedule.',
        messageType: 'text',
        readBy: ['Alice Johnson']
      },
      {
        chatId: chatId,
        sender: 'Dr. Sarah Mitchell',
        senderRole: 'main_doctor',
        senderType: 'clinic',
        content: 'Please share the updates, Alice.',
        messageType: 'text',
        readBy: ['Dr. Sarah Mitchell']
      }
    ];
    
    for (const message of messages) {
      await db.execute(sql`
        INSERT INTO messages (chat_id, sender, sender_role, sender_type, content, message_type, read_by)
        VALUES (${message.chatId}, ${message.sender}, ${message.senderRole}, ${message.senderType}, ${message.content}, ${message.messageType}, ${JSON.stringify(message.readBy)})
        ON CONFLICT DO NOTHING
      `);
    }
    
    console.log('✅ Sample messages created successfully');
    
    // Verify the messages
    const messageCount = await db.execute(sql`SELECT COUNT(*) as count FROM messages`);
    console.log(`📊 Total messages in database: ${messageCount.rows[0].count}`);
    
    const sampleMessages = await db.execute(sql`
      SELECT sender, content, read_by 
      FROM messages 
      ORDER BY created_at 
      LIMIT 5
    `);
    console.log('Sample messages:');
    sampleMessages.rows.forEach((msg: any) => {
      console.log(`  - ${msg.sender}: "${msg.content}" (Read by: [${msg.read_by.join(', ')}])`);
    });
    
  } catch (error) {
    console.error('❌ Error creating sample messages:', error);
  } finally {
    process.exit(0);
  }
}

createSampleMessages(); 