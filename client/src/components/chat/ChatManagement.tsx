import ChatHeader from './ChatHeader';
import ClinicChats from './ClinicChats';

const ChatManagement = () => {
  const handleCreateChat = () => {
    // Replace with modal or navigation logic as needed
    alert('Open create chat modal!');
  };

  return (
    <div>
      <ChatHeader onCreateChat={handleCreateChat} />
      <ClinicChats />
    </div>
  );
};

export default ChatManagement; 