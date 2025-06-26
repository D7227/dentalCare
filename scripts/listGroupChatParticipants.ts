import { db } from '../server/db';
import { chats } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function listGroupChatParticipants() {
  try {
    console.log('Listing all group chats and their participants...');
    const groupChats = await db.select().from(chats).where(eq(chats.type, 'group'));
    if (groupChats.length === 0) {
      console.log('No group chats found.');
      return;
    }
    groupChats.forEach(chat => {
      console.log(`\nGroup Chat: ${chat.title} (ID: ${chat.id})`);
      console.log(`Participants: ${Array.isArray(chat.participants) ? chat.participants.join(', ') : 'None'}`);
    });
    console.log('\nDone.');
  } catch (error) {
    console.error('Error listing group chat participants:', error);
  } finally {
    process.exit(0);
  }
}

listGroupChatParticipants(); 