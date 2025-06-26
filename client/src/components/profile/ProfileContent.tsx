import React, { useState, useRef, ChangeEvent } from 'react';
import { Pen, LogOut, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GradientInput from '@/components/ui/gradient-input';
import { Label } from '@/components/ui/label';

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
}

interface Errors {
  gstNumber: string;
  panNumber: string;
}

const ProfileContent: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'Dr. Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@smiledental.com',
    phone: '+1 (555) 123-4567',
    clinicName: 'Smile Dental Clinic',
    licenseNumber: 'DDS-12345',
    clinicAddressLine1: '123 Medical Center Dr',
    clinicAddressLine2: 'Suite 401',
    clinicCity: 'Mumbai',
    clinicState: 'Maharashtra',
    clinicPincode: '400001',
    clinicCountry: 'India',
    billingAddressLine1: '123 Medical Center Dr',
    billingAddressLine2: 'Suite 401',
    billingCity: 'Mumbai',
    billingState: 'Maharashtra',
    billingPincode: '400001',
    billingCountry: 'India',
    gstNumber: '27ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F'
  });
  const [errors, setErrors] = useState<Errors>({ gstNumber: '', panNumber: '' });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateGST = (gst: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
  const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const handleSave = () => {
    const newErrors: Errors = { gstNumber: '', panNumber: '' };
    if (profileData.gstNumber && !validateGST(profileData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST format. Format: 22AAAAA0000A1Z5';
    }
    if (profileData.panNumber && !validatePAN(profileData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format. Format: AAAAA0000A';
    }
    setErrors(newErrors);
    if (!newErrors.gstNumber && !newErrors.panNumber) {
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (field === 'gstNumber' || field === 'panNumber') {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const copyClinicToBilling = () => {
    setProfileData(prev => ({
      ...prev,
      billingAddressLine1: prev.clinicAddressLine1,
      billingAddressLine2: prev.clinicAddressLine2,
      billingCity: prev.clinicCity,
      billingState: prev.clinicState,
      billingPincode: prev.clinicPincode,
      billingCountry: prev.clinicCountry
    }));
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
    colSpan: number = 1
  ) => (
    <div className={`flex flex-col gap-1 ${colSpan === 2 ? 'md:col-span-2' : ''}`}>
      <Label className="text-16/25 text-customGray-100 font-medium mb-1">{label}</Label>
      {isEditing ? (
        <GradientInput
          type={type}
          value={value}
          onChange={e => handleInputChange(field, type === 'text' ? e.target.value : e.target.value.toUpperCase())}
          className=""
        />
      ) : (
        <span className="text-14/24 text-foreground font-medium flex items-center">{value || <span className="text-muted-foreground">-</span>}</span>
      )}
    </div>
  );

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
          <p className="text-muted-foreground text-sm mt-1">Manage your account settings and preferences</p>
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
          {/* Clinic Information */}
          <SectionCard title="Clinic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Clinic Name', profileData.clinicName, 'clinicName')}
              {renderField('License Number', profileData.licenseNumber, 'licenseNumber')}
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Address Line 1', profileData.clinicAddressLine1, 'clinicAddressLine1', 'text', 2)}
              {renderField('Address Line 2 (Optional)', profileData.clinicAddressLine2, 'clinicAddressLine2', 'text', 2)}
              {renderField('City', profileData.clinicCity, 'clinicCity')}
              {renderField('State', profileData.clinicState, 'clinicState')}
              {renderField('Pincode', profileData.clinicPincode, 'clinicPincode')}
              {renderField('Country', profileData.clinicCountry, 'clinicCountry')}
            </div>
          </SectionCard>
          {/* Billing Information */}
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
              {renderField('Address Line 1', profileData.billingAddressLine1, 'billingAddressLine1', 'text', 2)}
              {renderField('Address Line 2 (Optional)', profileData.billingAddressLine2, 'billingAddressLine2', 'text', 2)}
              {renderField('City', profileData.billingCity, 'billingCity')}
              {renderField('State', profileData.billingState, 'billingState')}
              {renderField('Pincode', profileData.billingPincode, 'billingPincode')}
              {renderField('Country', profileData.billingCountry, 'billingCountry')}
            </div>
            {isEditing && (
              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleSave}
                  className="bg-customGreen-200 text-white font-medium rounded-lg py-3 px-10 hover:bg-[#039855] transition-colors duration-150 border-none shadow-none"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </SectionCard>
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
