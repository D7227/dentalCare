import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Pen, LogOut, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GradientInput from '@/components/ui/gradient-input';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// Helper to convert camelCase to snake_case for backend
function toSnakeCase(obj: Record<string, any>) {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  }
  return newObj;
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
  console.log("user in ProfileContent", user); // DEBUG LOG
  const { data: profileData, isLoading, error } = useQuery<ClinicData>({
    queryKey: ['/api/userData', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      const response = await fetch(`/api/userData/${user.id}`);
      if (!response.ok) {
        const text = await response.text();
        console.error('Failed to fetch user data:', text); // DEBUG LOG
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    enabled: !!user?.id,
    retry: 1,
    retryDelay: 1000,
  });

  // Local state for editing profile
  const [editProfileData, setEditProfileData] = useState<ClinicData | null>(null);

  // Sync editProfileData with fetched profileData
  useEffect(() => {
    setEditProfileData(profileData ?? null);
  }, [profileData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ClinicData>) => {
      if (!user?.id) throw new Error('User ID not available');
      const memberpayload = {}
      if (data.userType !== 'clinic') {
        memberpayload.clinicName = data.clinicName?.trim();
        memberpayload.contactNumber = data.phone?.trim();
        memberpayload.roleName = data.roleName?.trim();
        memberpayload.permissions = data.permissions;
        memberpayload.profilePicture = data.profilePicture?.trim();
        memberpayload.email = data.email?.trim();
        memberpayload.fullName = data.firstName?.trim() + " " + data.lastName?.trim();
      }
      // console.log("memberpayload", memberpayload);
      const endpoint = data.userType === 'clinic'
        ? `/api/clinic/${user.id}`
        : `/api/team-members/${user.id}`;
      // Convert camelCase to snake_case before sending
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: data.userType === 'clinic' ? JSON.stringify(toSnakeCase(data)) : JSON.stringify(memberpayload),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: (_data: any) => {
      // Always refetch profile data from backend after update
      queryClient.invalidateQueries({ queryKey: ['/api/userData', user?.id] });
      setIsEditing(false);
      toast({ title: 'Profile Updated', description: 'Your profile has been updated successfully.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // const updateMutation = useMutation({
  //   mutationFn: async ({ id, data }: { id: string; data: any }) => {
  //     const response = await fetch(`/api/team-members/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(data)
  //     });
  //     if (!response.ok) throw new Error('Failed to update team member');
  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
  //     if (user?.clinicName) {
  //       queryClient.invalidateQueries({ queryKey: ['/api/team-members?clinicName=', user.clinicName] });
  //     }
  //     setCurrentView('list');
  //     resetForm();
  //     toast({ title: "Team member updated successfully" });
  //   },
  //   onError: () => {
  //     toast({ title: "Failed to update team member", variant: "destructive" });
  //   }
  // });

  const validateGST = (gst: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  // Only allow editing of personal details for team members
  const isClinic = editProfileData?.userType === 'clinic';
  const isTeamMember = editProfileData?.userType === 'teamMember';

  // Add state for required field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  // Track which fields have been touched (user focused and blurred)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [billingSameAsClinic, setBillingSameAsClinic] = useState(false);

  const handleSave = () => {
    console.log("handleSave==>", editProfileData);

    if (!editProfileData) return;
    updateProfileMutation.mutate(editProfileData);


    // if (!editProfileData) return;
    // const newErrors: Errors = { gstNumber: '', panNumber: '' };
    // let requiredFieldErrors: Record<string, string> = {};
    // // Required fields for clinic
    // if (isClinic) {
    //   if (!editProfileData.clinicName) requiredFieldErrors.clinicName = 'Clinic Name is required';
    //   if (!editProfileData.licenseNumber) requiredFieldErrors.licenseNumber = 'License Number is required';
    // }
    // // Required for all
    // if (!editProfileData.firstName) requiredFieldErrors.firstName = 'First Name is required';
    // if (!editProfileData.lastName) requiredFieldErrors.lastName = 'Last Name is required';
    // if (!editProfileData.email) requiredFieldErrors.email = 'Email is required';
    // if (!editProfileData.phone) requiredFieldErrors.phone = 'Phone is required';
    // // GST/PAN validation
    // if (editProfileData.gstNumber && !validateGST(editProfileData.gstNumber)) {
    //   newErrors.gstNumber = 'Invalid GST format. Format: 22AAAAA0000A1Z5';
    // }
    // if (editProfileData.panNumber && !validatePAN(editProfileData.panNumber)) {
    //   newErrors.panNumber = 'Invalid PAN format. Format: AAAAA0000A';
    // }
    // setErrors(newErrors);
    // setFieldErrors(requiredFieldErrors);
    // setSaveAttempted(true);
    // // Mark all required fields as touched on save attempt
    // const allTouched: Record<string, boolean> = { ...touchedFields };
    // Object.keys(requiredFieldErrors).forEach((key) => { allTouched[key] = true; });
    // setTouchedFields(allTouched);
    // if (
    //   Object.keys(requiredFieldErrors).length === 0 &&
    //   !newErrors.gstNumber &&
    //   !newErrors.panNumber
    // ) {
    //   updateProfileMutation.mutate(editProfileData);
    // }
  };

  const handleInputChange = (field: keyof ClinicData, value: string) => {
    if (!editProfileData) return;
    // Only allow editing of personal details for team members
    if (isTeamMember && !['firstName', 'lastName', 'email', 'phone'].includes(field)) return;
    // If user edits any billing field, uncheck the checkbox
    if ([
      'billingAddressLine1',
      'billingAddressLine2',
      'billingCity',
      'billingState',
      'billingPincode',
      'billingCountry',
    ].includes(field)) {
      setBillingSameAsClinic(false);
    }
    setEditProfileData(prev => prev ? { ...prev, [field]: value } : prev);
    if (field === 'gstNumber' || field === 'panNumber') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear error and touched state for this field if value is not empty
    if (value) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
      setTouchedFields(prev => ({ ...prev, [field]: false }));
    }
  };

  const copyClinicToBilling = () => {
    if (!editProfileData) return;
    setEditProfileData(prev => prev ? {
      ...prev,
      billingAddressLine1: prev.clinicAddressLine1,
      billingAddressLine2: prev.clinicAddressLine2,
      billingCity: prev.clinicCity,
      billingState: prev.clinicState,
      billingPincode: prev.clinicPincode,
      billingCountry: prev.clinicCountry
    } : prev);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Add onBlur handler to mark fields as touched
  const handleBlur = (field: keyof ClinicData) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  // When checkbox is toggled
  const handleBillingSameAsClinicChange = (checked: boolean) => {
    setBillingSameAsClinic(checked);
    if (checked && editProfileData) {
      // Copy clinic address to billing address
      setEditProfileData(prev => prev ? {
        ...prev,
        billingAddressLine1: prev.clinicAddressLine1,
        billingAddressLine2: prev.clinicAddressLine2,
        billingCity: prev.clinicCity,
        billingState: prev.clinicState,
        billingPincode: prev.clinicPincode,
        billingCountry: prev.clinicCountry
      } : prev);
    } else if (!checked && editProfileData) {
      // Clear billing address fields
      setEditProfileData(prev => prev ? {
        ...prev,
        billingAddressLine1: '',
        billingAddressLine2: '',
        billingCity: '',
        billingState: '',
        billingPincode: '',
        billingCountry: ''
      } : prev);
    }
  };

  // Helper for rendering fields
  const renderField = (
    label: string,
    value: string,
    field: keyof ClinicData,
    type: string = 'text',
    colSpan: number = 1,
    disabled: boolean = false,
    show: boolean = true,
    required: boolean = false,
    errorMsg: string = ''
  ) => {
    if (!show) return null;
    const showError = (saveAttempted || touchedFields[field]) && errorMsg;
    return (
      <div className={`flex flex-col gap-0.2 ${colSpan === 2 ? 'md:col-span-2' : ''}`}>
        <Label className="text-16/25 text-customGray-100 font-medium mb-1">
          {label}{required && isEditing && <span className="text-red-500">*</span>}
        </Label>
        {isEditing ? (
          <GradientInput
            type={type}
            value={value}
            onChange={e => handleInputChange(field, type === 'text' ? e.target.value : e.target.value.toUpperCase())}
            className=""
            disabled={disabled}
            onBlur={() => handleBlur(field)}
          />
        ) : (
          <span className="text-14/24 text-foreground font-medium flex items-center">{value || <span className="text-muted-foreground">-</span>}</span>
        )}
        {showError && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
      </div>
    );
  };

  if (isLoading || !editProfileData) {
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
              onClick={() => { queryClient.invalidateQueries({ queryKey: ['/api/userData', user?.id] }); window.location.reload(); }}
              className="mt-4"
            >
              Retry
            </Button>
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
          onClick={() => {
            setIsEditing(!isEditing);
            setEditProfileData(profileData ?? null); // Reset edits on cancel
          }}
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
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-xl object-cover border border-[#E4E7EC] shadow"
                style={{ width: 96, height: 96 }}
              />
            ) : (
              <div className="w-24 h-24 rounded-xl flex items-center justify-center bg-gray-100 border border-[#E4E7EC] shadow" style={{ width: 96, height: 96 }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="#E4E7EC" />
                  <path d="M24 24c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 4c-5.33 0-16 2.668-16 8v4h32v-4c0-5.332-10.67-8-16-8z" fill="#A0AEC0" />
                </svg>
              </div>
            )}
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
            {editProfileData?.userType === 'clinic' ? 'Clinic Profile' : 'Team Member Profile'}
          </p>
        </div>
        <div className="px-6 pb-6">
          {/* General Information */}
          <SectionCard title="General Information">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {renderField('First Name', editProfileData.firstName, 'firstName', 'text', 1, isTeamMember ? false : false, true)}
                {renderField('Last Name', editProfileData.lastName, 'lastName', 'text', 1, isTeamMember ? false : false, true)}
                {renderField('Email', editProfileData.email, 'email', 'text', 1, isTeamMember ? false : false, true)}
                {renderField('Phone', editProfileData.phone, 'phone', 'text', 1, isTeamMember ? false : false, true)}
              </div>
              {
                editProfileData?.userType !== 'clinic' && (
                  <>
                    {
                      isEditing && (
                        <div className='flex justify-center'>
                        <Button
                          onClick={handleSave}
                          disabled={updateProfileMutation.isPending}
                          className="bg-customGreen-200 text-white font-medium rounded-lg py-3 px-10 hover:bg-[#039855] transition-colors duration-150 border-none shadow-none mt-4"
                        >
                          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                          </div>
                      )
                    }
                  </>
                )
              }
            </div>

          </SectionCard>
          {/* Clinic Information - Only show for clinic/main_doctor */}
          {(editProfileData?.userType === 'clinic' || editProfileData?.roleName === 'main_doctor') && (
            <SectionCard title="Clinic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Clinic Name', editProfileData.clinicName, 'clinicName', 'text', 2, isTeamMember, isClinic, true, fieldErrors.clinicName)}
                {renderField('License Number', editProfileData.licenseNumber, 'licenseNumber', 'text', 2, isTeamMember, isClinic, true, fieldErrors.licenseNumber)}
                {renderField('Address Line 1', editProfileData.clinicAddressLine1, 'clinicAddressLine1', 'text', 2, isTeamMember, isClinic, false, fieldErrors.clinicAddressLine1)}
                {renderField('Address Line 2 (Optional)', editProfileData.clinicAddressLine2, 'clinicAddressLine2', 'text', 2, isTeamMember, isClinic)}
                {/* City/State row */}
                {renderField('City', editProfileData.clinicCity, 'clinicCity', 'text', 1, isTeamMember, isClinic)}
                {renderField('State', editProfileData.clinicState, 'clinicState', 'text', 1, isTeamMember, isClinic)}
                {/* Pincode/Country row */}
                {renderField('Pincode', editProfileData.clinicPincode, 'clinicPincode', 'text', 1, isTeamMember, isClinic)}
                {renderField('Country', editProfileData.clinicCountry, 'clinicCountry', 'text', 1, isTeamMember, isClinic)}
              </div>
            </SectionCard>
          )}
          {/* Billing Information - Only show for clinic */}
          {editProfileData?.userType === 'clinic' && (
            <SectionCard title="Billing Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {renderField('GST Number', editProfileData.gstNumber, 'gstNumber', 'text', 1, false, true)}
                  {errors.gstNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>
                  )}
                </div>
                <div>
                  {renderField('PAN Number', editProfileData.panNumber, 'panNumber', 'text', 1, false, true)}
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
                    checked={billingSameAsClinic}
                    onChange={e => handleBillingSameAsClinicChange(e.target.checked)}
                  />
                  <Label htmlFor="sameAsClinic" className="text-sm text-muted-foreground cursor-pointer">
                    Billing address is same as clinic address
                  </Label>
                </div>
              )}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Address Line 1', editProfileData.billingAddressLine1, 'billingAddressLine1', 'text', 2, false, true)}
                {renderField('Address Line 2 (Optional)', editProfileData.billingAddressLine2, 'billingAddressLine2', 'text', 2, false, true)}
                {/* City/State row */}
                {renderField('City', editProfileData.billingCity, 'billingCity', 'text', 1, false, true)}
                {renderField('State', editProfileData.billingState, 'billingState', 'text', 1, false, true)}
                {/* Pincode/Country row */}
                {renderField('Pincode', editProfileData.billingPincode, 'billingPincode', 'text', 1, false, true)}
                {renderField('Country', editProfileData.billingCountry, 'billingCountry', 'text', 1, false, true)}
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