import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

const ClinicChats = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      let url = '/api/chats';
      if (user?.roleName === 'main_doctor' && user.clinicId) {
        url += `?clinicId=${user.clinicId}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setChats(data);
      setLoading(false);
    };
    fetchChats();
  }, [user]);

  if (loading) return <div>Loading chats...</div>;

  return (
    <div>
      {chats.length === 0 ? (
        <div>No chats found for your clinic.</div>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>{chat.title || 'Untitled Chat'}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClinicChats; 