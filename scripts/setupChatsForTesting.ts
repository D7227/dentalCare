import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function setupChatsForTesting() {
  try {
    console.log('🔧 Setting up chats for testing...');
    
    // Step 1: Add createdBy column if it doesn't exist
    console.log('📝 Step 1: Adding createdBy column...');
    const columnExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'chats' AND column_name = 'created_by'
    `);
    
    if (columnExists.rows.length === 0) {
      await db.execute(sql`
        ALTER TABLE chats 
        ADD COLUMN created_by TEXT
      `);
      console.log('✅ createdBy column added successfully');
    } else {
      console.log('ℹ️ createdBy column already exists');
    }
    
    // Step 2: Create sample chats
    console.log('📝 Step 2: Creating sample chats...');
    
    // Clear existing chats for clean testing
    await db.execute(sql`DELETE FROM messages`);
    await db.execute(sql`DELETE FROM chats`);
    
    // Create sample chats
    const sampleChats = [
      {
        type: 'master',
        title: 'Master Group',
        participants: ['Dr. Sarah Mitchell', 'Dr. John Smith', 'Alice Johnson'],
        createdBy: 'Dr. Sarah Mitchell',
        clinicId: '550e8400-e29b-41d4-a716-446655440000',
        isActive: true
      },
      {
        type: 'order',
        title: 'Order #12345 Discussion',
        participants: ['Dr. Sarah Mitchell', 'Dr. John Smith'],
        createdBy: 'Dr. Sarah Mitchell',
        clinicId: '550e8400-e29b-41d4-a716-446655440000',
        isActive: true
      },
      {
        type: 'support',
        title: 'Technical Support',
        participants: ['Dr. Sarah Mitchell', 'Alice Johnson'],
        createdBy: 'Dr. Sarah Mitchell',
        clinicId: '550e8400-e29b-41d4-a716-446655440000',
        isActive: true
      }
    ];
    
    for (const chat of sampleChats) {
      await db.execute(sql`
        INSERT INTO chats (type, title, participants, created_by, clinic_id, is_active)
        VALUES (${chat.type}, ${chat.title}, ${JSON.stringify(chat.participants)}, ${chat.createdBy}, ${chat.clinicId}, ${chat.isActive})
      `);
    }
    
    console.log('✅ Sample chats created successfully');
    
    // Step 3: Create sample messages
    console.log('📝 Step 3: Creating sample messages...');
    
    // Get the first chat ID for messages
    const chatResult = await db.execute(sql`
      SELECT id FROM chats WHERE type = 'master' LIMIT 1
    `);
    
    if (chatResult.rows.length > 0) {
      const chatId = chatResult.rows[0].id;
      
      const sampleMessages = [
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
          readBy: ['Alice Johnson'] // This message is unread by Dr. Sarah and Dr. John
        },
        {
          chatId: chatId,
          sender: 'Dr. Sarah Mitchell',
          senderRole: 'main_doctor',
          senderType: 'clinic',
          content: 'Please share the updates, Alice.',
          messageType: 'text',
          readBy: ['Dr. Sarah Mitchell'] // This message is unread by Dr. John and Alice
        }
      ];
      
      for (const message of sampleMessages) {
        await db.execute(sql`
          INSERT INTO messages (chat_id, sender, sender_role, sender_type, content, message_type, read_by)
          VALUES (${message.chatId}, ${message.sender}, ${message.senderRole}, ${message.senderType}, ${message.content}, ${message.messageType}, ${JSON.stringify(message.readBy)})
        `);
      }
      
      console.log('✅ Sample messages created successfully');
    }
    
    // Step 4: Verify the setup
    console.log('📝 Step 4: Verifying setup...');
    
    const chatCount = await db.execute(sql`SELECT COUNT(*) as count FROM chats`);
    console.log(`📊 Total chats in database: ${chatCount.rows[0].count}`);
    
    const messageCount = await db.execute(sql`SELECT COUNT(*) as count FROM messages`);
    console.log(`📊 Total messages in database: ${messageCount.rows[0].count}`);
    
    const sampleChatsData = await db.execute(sql`
      SELECT type, title, participants, created_by, is_active 
      FROM chats 
      ORDER BY type
    `);
    console.log('Sample chats:');
    sampleChatsData.rows.forEach((chat: any) => {
      console.log(`  - ${chat.title} (${chat.type}): Created by ${chat.created_by}, Active: ${chat.is_active}, Participants: [${chat.participants.join(', ')}]`);
    });
    
    const sampleMessagesData = await db.execute(sql`
      SELECT sender, content, read_by 
      FROM messages 
      ORDER BY created_at 
      LIMIT 5
    `);
    console.log('Sample messages:');
    sampleMessagesData.rows.forEach((msg: any) => {
      console.log(`  - ${msg.sender}: "${msg.content}" (Read by: [${msg.read_by.join(', ')}])`);
    });
    
    console.log('\n✅ Chat setup for testing completed successfully!');
    console.log('💡 Now you can test the unread message functionality.');
    console.log('   - Dr. Sarah Mitchell should see 2 unread messages');
    console.log('   - Dr. John Smith should see 2 unread messages');
    console.log('   - Alice Johnson should see 1 unread message');
    
  } catch (error) {
    console.error('❌ Error setting up chats for testing:', error);
  } finally {
    process.exit(0);
  }
}

setupChatsForTesting(); 