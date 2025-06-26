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

export const useClinicMembers = (clinicName?: string) => {
  const queryKey = clinicName
    ? ['/api/team-members?clinicName=', clinicName]
    : ['/api/team-members'];

  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery<ClinicMember[]>({
    queryKey,
  });

  return {
    members,
    isLoading,
    error,
  };
}; 