
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, CreditCard, Lock, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ProfileContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // General Information
    firstName: 'Dr. Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@smiledental.com',
    phone: '+1 (555) 123-4567',
    
    // Clinic Information
    clinicName: 'Smile Dental Clinic',
    licenseNumber: 'DDS-12345',
    clinicAddressLine1: '123 Medical Center Dr',
    clinicAddressLine2: 'Suite 401',
    clinicCity: 'Mumbai',
    clinicState: 'Maharashtra',
    clinicPincode: '400001',
    clinicCountry: 'India',
    
    // Billing Information
    billingAddressLine1: '123 Medical Center Dr',
    billingAddressLine2: 'Suite 401',
    billingCity: 'Mumbai',
    billingState: 'Maharashtra',
    billingPincode: '400001',
    billingCountry: 'India',
    gstNumber: '27ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F'
  });

  const [errors, setErrors] = useState({
    gstNumber: '',
    panNumber: ''
  });

  const validateGST = (gst: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handleSave = () => {
    const newErrors = { gstNumber: '', panNumber: '' };
    
    if (profileData.gstNumber && !validateGST(profileData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST format. Format: 22AAAAA0000A1Z5';
    }
    
    if (profileData.panNumber && !validatePAN(profileData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN format. Format: AAAAA0000A';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.gstNumber && !newErrors.panNumber) {
      console.log('Saving profile:', profileData);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (field === 'gstNumber' || field === 'panNumber') {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* General Information */}
      <Card className="card clinical-shadow">
        <CardHeader className="card-header">
          <div className="flex items-center justify-between">
            <CardTitle className="card-title flex items-center gap-2">
              <User className="h-5 w-5" />
              General Information
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="btn-ghost"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="card-content">
          <div className="form-grid space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field">
                <Label htmlFor="firstName" className="form-label">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              <div className="form-field">
                <Label htmlFor="lastName" className="form-label">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field">
                <Label htmlFor="email" className="form-label">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              <div className="form-field">
                <Label htmlFor="phone" className="form-label">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinic Information */}
      <Card className="card clinical-shadow">
        <CardHeader className="card-header">
          <CardTitle className="card-title flex items-center gap-2">
            <Building className="h-5 w-5" />
            Clinic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="form-grid space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field">
                <Label htmlFor="clinicName" className="form-label">Clinic Name</Label>
                <Input
                  id="clinicName"
                  value={profileData.clinicName}
                  onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
              <div className="form-field">
                <Label htmlFor="licenseNumber" className="form-label">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={profileData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>
            </div>

            <div className="form-field">
              <Label className="form-label">Clinic Address</Label>
              <div className="space-y-3">
                <Input
                  placeholder="Address Line 1"
                  value={profileData.clinicAddressLine1}
                  onChange={(e) => handleInputChange('clinicAddressLine1', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
                <Input
                  placeholder="Address Line 2 (Optional)"
                  value={profileData.clinicAddressLine2}
                  onChange={(e) => handleInputChange('clinicAddressLine2', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={profileData.clinicCity}
                    onChange={(e) => handleInputChange('clinicCity', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                  <Input
                    placeholder="State"
                    value={profileData.clinicState}
                    onChange={(e) => handleInputChange('clinicState', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Pincode"
                    value={profileData.clinicPincode}
                    onChange={(e) => handleInputChange('clinicPincode', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                  <Input
                    placeholder="Country"
                    value={profileData.clinicCountry}
                    onChange={(e) => handleInputChange('clinicCountry', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card className="card clinical-shadow">
        <CardHeader className="card-header">
          <CardTitle className="card-title flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="form-grid space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field">
                <Label htmlFor="gstNumber" className="form-label">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={profileData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                  disabled={!isEditing}
                  className={`input-field ${errors.gstNumber ? 'border-red-500' : ''}`}
                  placeholder="22AAAAA0000A1Z5"
                />
                {errors.gstNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>
                )}
              </div>
              <div className="form-field">
                <Label htmlFor="panNumber" className="form-label">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={profileData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  disabled={!isEditing}
                  className={`input-field ${errors.panNumber ? 'border-red-500' : ''}`}
                  placeholder="AAAAA0000A"
                />
                {errors.panNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="sameAsClinic"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  onChange={(e) => {
                    if (e.target.checked) {
                      copyClinicToBilling();
                    }
                  }}
                />
                <Label htmlFor="sameAsClinic" className="text-sm text-muted-foreground cursor-pointer">
                  Billing address is same as clinic address
                </Label>
              </div>
            )}

            <div className="form-field">
              <Label className="form-label">Billing Address</Label>
              <div className="space-y-3">
                <Input
                  placeholder="Address Line 1"
                  value={profileData.billingAddressLine1}
                  onChange={(e) => handleInputChange('billingAddressLine1', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
                <Input
                  placeholder="Address Line 2 (Optional)"
                  value={profileData.billingAddressLine2}
                  onChange={(e) => handleInputChange('billingAddressLine2', e.target.value)}
                  disabled={!isEditing}
                  className="input-field"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={profileData.billingCity}
                    onChange={(e) => handleInputChange('billingCity', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                  <Input
                    placeholder="State"
                    value={profileData.billingState}
                    onChange={(e) => handleInputChange('billingState', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Pincode"
                    value={profileData.billingPincode}
                    onChange={(e) => handleInputChange('billingPincode', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                  <Input
                    placeholder="Country"
                    value={profileData.billingCountry}
                    onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleSave} className="btn-primary">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="card clinical-shadow">
        <CardHeader className="card-header">
          <CardTitle className="card-title flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <p className="text-muted-foreground mb-4">
            Click "Change Password" to update your account password.
          </p>
          <Button variant="outline" className="btn-outline">
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileContent;
