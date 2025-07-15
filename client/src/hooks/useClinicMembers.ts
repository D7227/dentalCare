import { useQuery } from '@tanstack/react-query';

export interface ClinicMember {
  id: string;
  fullName: string;
  email?: string;
  contactNumber?: string;
  profilePicture?: string;
  roleName?: string;
  status?: string;
}

export const useClinicMembers = (clinicId?: string) => {
  const queryKey = [`/api/team-members/${clinicId}`];

  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery<ClinicMember[]>({
    queryKey,
    queryFn: async () => {
      const token = localStorage.getItem('doctor_access_token');
      const response = await fetch(`/api/team-members/${clinicId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error('Failed to fetch clinic members');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!clinicId,
  });

  return {
    members,
    isLoading,
    error,
  };
}; 