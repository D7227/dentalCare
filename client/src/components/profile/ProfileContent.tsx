import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Pen, LogOut, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GradientInput from '@/components/ui/gradient-input';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/store/hooks';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// SectionCard helper for section layout
interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}
const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => (
  <div
    className="rounded-xl border border-[#D9F5E7] mb-6"
    style={{
      background: 'linear-gradient(135deg, #fff 60%, #E9F8F2 100%)',
    }}
  >
    <div className="px-6 pt-4 pb-2">
      <div className="font-semibold text-lg text-foreground pb-2 border-b border-[#D9F5E7]">
        {title}
      </div>
    </div>
    <div className="px-6 pb-6 pt-2">
      {children}
    </div>
  </div>
);

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  clinicName: string;
  licenseNumber: string;
  clinicAddressLine1: string;
  clinicAddressLine2: string;
  clinicCity: string;
  clinicState: string;
  clinicPincode: string;
  clinicCountry: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  billingCountry: string;
  gstNumber: string;
  panNumber: string;
  roleName: string;
  userType: string;
  permissions: string[];
}

interface Errors {
  gstNumber: string;
  panNumber: string;
}

const ProfileContent: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({ gstNumber: '', panNumber: '' });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data from API using user ID
  const { data: profileData, isLoading, error } = useQuery<ProfileData>({
    queryKey: ['/api/userData', user?.id],
    queryFn: async () => {
      
      if (!user?.id) {
        console.error('User ID not available');
        throw new Error('User ID not available');
      }
      
      const response = await fetch(`/api/userData/${user.id}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    },
    enabled: !!user?.id,
    retry: 1,
    retryDelay: 1000,
  });

  // Update profile mutation - using existing team member or clinic update endpoints
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      if (!user?.id) {
        throw new Error('User ID not available');
      }

      // Determine which endpoint to use based on user type
      const endpoint = data.userType === 'clinic' 
        ? `/api/clinics/${user.id}` 
        : `/api/team-members/${user.id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/userData', user?.id] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateGST = (gst: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const handleSave = () => {
    if (!profileData) return;

    const newErrors: Errors = { gstNumber: '', panNumber: '' };
    if (profileData.gstNumber && !validateGST(profileData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST format. Format: 22AAAAA0000A1Z5';
    }
    if (profileData.panNumber && !validatePAN(profileData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format. Format: AAAAA0000A';
    }
    setErrors(newErrors);
    
    if (!newErrors.gstNumber && !newErrors.panNumber) {
      updateProfileMutation.mutate(profileData);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (!profileData) return;
    
    const updatedData = { ...profileData, [field]: value };
    queryClient.setQueryData(['/api/userData', user?.id], updatedData);
    
    if (field === 'gstNumber' || field === 'panNumber') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const copyClinicToBilling = () => {
    if (!profileData) return;
    
    const updatedData = {
      ...profileData,
      billingAddressLine1: profileData.clinicAddressLine1,
      billingAddressLine2: profileData.clinicAddressLine2,
      billingCity: profileData.clinicCity,
      billingState: profileData.clinicState,
      billingPincode: profileData.clinicPincode,
      billingCountry: profileData.clinicCountry
    };
    queryClient.setQueryData(['/api/userData', user?.id], updatedData);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Helper for rendering fields
  const renderField = (
    label: string,
    value: string,
    field: keyof ProfileData,
    type: string = 'text',
    colSpan: number = 1,
    disabled: boolean = false
  ) => (
    <div className={`mb-4 flex flex-col gap-0.2 ${colSpan === 2 ? 'md:col-span-2' : ''}`}>
      <Label className="text-16/25 text-customGray-100 font-medium mb-0.5">{label}</Label>
      {isEditing ? (
        <GradientInput
          type={type}
          value={value}
          onChange={e => handleInputChange(field, type === 'text' ? e.target.value : e.target.value.toUpperCase())}
          className=""
          disabled={disabled}
        />
      ) : (
        <span className="text-14/24 text-foreground font-medium flex items-center">{value || <span className="text-muted-foreground">-</span>}</span>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Error loading profile data</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <p className="text-red-500">Failed to load profile data. Please try again.</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/userData', user?.id] })}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">No profile data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        {/* Edit/Cancel Button */}
        <button
          className="btn btn-outline py-[12px] px-[16px] rounded-[10px]"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Pen className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-0 relative border border-border">
        {/* Profile Image and Title */}
        <div className="flex flex-col items-center pt-8 pb-2">
          <div className="relative">
            <img
              src={profileImage || 'https://randomuser.me/api/portraits/women/44.jpg'}
              alt="Profile"
              className="w-24 h-24 rounded-xl object-cover border border-[#E4E7EC] shadow"
              style={{ width: 96, height: 96 }}
            />
            {isEditing && (
              <button
                className="absolute -bottom-3 -right-3 bg-white border border-[#E4E7EC] rounded-lg p-1 shadow flex items-center justify-center transition-colors duration-150 hover:bg-[#E9F8F2]"
                style={{ width: 32, height: 32 }}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                type="button"
              >
                <Pen className="w-4 h-4 text-customGray-100" />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </button>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Profile Information</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {profileData.userType === 'clinic' ? 'Clinic Profile' : 'Team Member Profile'}
          </p>
        </div>
        <div className="px-6 pb-6">
          {/* General Information */}
          <SectionCard title="General Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('First Name', profileData.firstName, 'firstName')}
              {renderField('Last Name', profileData.lastName, 'lastName')}
              {renderField('Email', profileData.email, 'email', 'text')}
              {renderField('Phone', profileData.phone, 'phone', 'text')}
            </div>
          </SectionCard>
          
          {/* Clinic Information - Only show for main_doctor or if user has clinic data */}
          {(profileData.userType === 'clinic' || profileData.roleName === 'main_doctor') && (
            <SectionCard title="Clinic Information">
             
                {renderField('Clinic Name', profileData.clinicName, 'clinicName')}
                {renderField('License Number', profileData.licenseNumber, 'licenseNumber')}
                {renderField('Address Line 1', profileData.clinicAddressLine1, 'clinicAddressLine1', 'text', 2)}
            </SectionCard>
          )}
          
          {/* Billing Information - Only show for main_doctor */}
          {profileData.userType === 'clinic' && (
            <SectionCard title="Billing Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderField('GST Number', profileData.gstNumber, 'gstNumber', 'text')}
                  {errors.gstNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>
                  )}
                </div>
                <div>
                  {renderField('PAN Number', profileData.panNumber, 'panNumber', 'text')}
                  {errors.panNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="flex items-center space-x-2 mt-4 mb-2">
                  <input
                    type="checkbox"
                    id="sameAsClinic"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    onChange={e => { if (e.target.checked) copyClinicToBilling(); }}
                  />
                  <Label htmlFor="sameAsClinic" className="text-sm text-muted-foreground cursor-pointer">
                    Billing address is same as clinic address
                  </Label>
                </div>
              )}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderField('Billing Address', profileData.billingAddress, 'Billing Address', 'text', 2)}
              </div>
              {isEditing && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="bg-customGreen-200 text-white font-medium rounded-lg py-3 px-10 hover:bg-[#039855] transition-colors duration-150 border-none shadow-none"
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </SectionCard>
          )}
        </div>
      </div>
      {/* Bottom Action Buttons */}
      {!isEditing && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 px-4 pb-6">
          <Button
            variant="outline"
            className="w-full sm:w-48 border border-[#F04438] text-[#F04438] font-medium rounded-lg py-3 px-6 flex items-center justify-center gap-2 transition-colors duration-150 hover:bg-[#FFF0F0] hover:text-[#F04438] hover:border-[#F04438]"
          >
            Deactivate account
            <Trash2 className="w-4 h-4 mr-2 text-[#F04438] transition-colors duration-150" />
          </Button>
          <Button
            variant="default"
            className="w-full sm:w-48 bg-customGreen-200 text-white font-medium rounded-lg py-3 px-6 hover:bg-[#039855] transition-colors duration-150 border-none"
          >
            Log Out
            <LogOut className="w-4 h-4 mr-2" />
          </Button>
        </div>
      )}

    </div>
  );
};

export default ProfileContent;
