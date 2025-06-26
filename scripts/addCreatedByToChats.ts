import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function addCreatedByToChats() {
  try {
    console.log('🔧 Adding createdBy column to chats table...');
    
    // Check if the column already exists
    const columnExists = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'chats' AND column_name = 'created_by'
    `);
    
    if (columnExists.rows.length === 0) {
      // Add the createdBy column
      await db.execute(sql`
        ALTER TABLE chats 
        ADD COLUMN created_by TEXT
      `);
      console.log('✅ createdBy column added successfully');
    } else {
      console.log('ℹ️ createdBy column already exists');
    }
    
    // Create some sample chats for testing
    console.log('📝 Creating sample chats...');
    
    // Sample chat 1 - Master chat
    await db.execute(sql`
      INSERT INTO chats (type, title, participants, created_by, clinic_id, is_active)
      VALUES ('master', 'Master Group', ARRAY['Dr. Sarah Mitchell', 'Dr. John Smith', 'Alice Johnson'], 'Dr. Sarah Mitchell', '550e8400-e29b-41d4-a716-446655440000', true)
      ON CONFLICT DO NOTHING
    `);
    
    // Sample chat 2 - Order chat
    await db.execute(sql`
      INSERT INTO chats (type, title, participants, created_by, clinic_id, is_active)
      VALUES ('order', 'Order #12345 Discussion', ARRAY['Dr. Sarah Mitchell', 'Dr. John Smith'], 'Dr. Sarah Mitchell', '550e8400-e29b-41d4-a716-446655440000', true)
      ON CONFLICT DO NOTHING
    `);
    
    // Sample chat 3 - Support chat
    await db.execute(sql`
      INSERT INTO chats (type, title, participants, created_by, clinic_id, is_active)
      VALUES ('support', 'Technical Support', ARRAY['Dr. Sarah Mitchell', 'Alice Johnson'], 'Dr. Sarah Mitchell', '550e8400-e29b-41d4-a716-446655440000', true)
      ON CONFLICT DO NOTHING
    `);
    
    console.log('✅ Sample chats created successfully');
    
    // Verify the changes
    const chatCount = await db.execute(sql`SELECT COUNT(*) as count FROM chats`);
    console.log(`📊 Total chats in database: ${chatCount.rows[0].count}`);
    
    const sampleChats = await db.execute(sql`
      SELECT type, title, participants, created_by, is_active 
      FROM chats 
      LIMIT 5
    `);
    console.log('Sample chats:');
    sampleChats.rows.forEach((chat: any) => {
      console.log(`  - ${chat.title} (${chat.type}): Created by ${chat.created_by}, Active: ${chat.is_active}, Participants: [${chat.participants.join(', ')}]`);
    });
    
  } catch (error) {
    console.error('❌ Error adding createdBy column:', error);
  } finally {
    process.exit(0);
  }
}

addCreatedByToChats(); 