import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';

const ChatHeader = ({ onCreateChat }: { onCreateChat: () => void }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Clinic Chats</h2>
      {user?.roleName === 'main_doctor' && user.permissions.includes('create_chat') && (
        <Button onClick={onCreateChat}>Create Chat</Button>
      )}
    </div>
  );
};

export default ChatHeader; 