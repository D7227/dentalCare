import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRegisterMutation } from '@/store/slices/doctorAuthApi';

const initialFormData = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  clinicName: '',
  clinicLicenseNumber: '',
  gstNumber: '',
  panNumber: '',
  address: '',
  password: '',
  roleId: '2411f233-1e48-43ae-9af9-6d5ce0569278',
  permissions: [
    'scan_booking',
    'tracking',
    'pickup_requests',
    'chat',
    'all_patients',
    'billing',
  ],
  clinicAddressLine1: '',
  clinicAddressLine2: '',
  clinicCity: '',
  clinicState: '',
  clinicPincode: '',
  clinicCountry: '',
  billingAddressLine1: '',
  billingAddressLine2: '',
  billingCity: '',
  billingState: '',
  billingPincode: '',
  billingCountry: '',
  confirmPassword: '',
};

// Add this type for errors
interface RegisterFormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  clinicName?: string;
  clinicLicenseNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
}

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;

const Register = () => {
  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [billingSameAsClinic, setBillingSameAsClinic] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  React.useEffect(() => {
    if (error) {
      // The original code had dispatch(clearError()) here, but clearError is removed from imports.
      // Assuming the intent was to handle the error if the mutation itself provides it.
      // For now, removing the line as per the new_code.
    }
  }, [error]);

  // If billingSameAsClinic is checked, copy clinic address fields to billing address fields
  React.useEffect(() => {
    if (billingSameAsClinic) {
      setFormData((prev) => ({
        ...prev,
        billingAddressLine1: prev.clinicAddressLine1,
        billingAddressLine2: prev.clinicAddressLine2,
        billingCity: prev.clinicCity,
        billingState: prev.clinicState,
        billingPincode: prev.clinicPincode,
        billingCountry: prev.clinicCountry,
      }));
    }
  }, [billingSameAsClinic, formData.clinicAddressLine1, formData.clinicAddressLine2, formData.clinicCity, formData.clinicState, formData.clinicPincode, formData.clinicCountry]);

  const validateForm = () => {
    const newErrors: RegisterFormErrors = {};
    // First Name
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    else if (formData.firstname.length < 2) newErrors.firstname = 'First name must be at least 2 characters';
    // Last Name
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    else if (formData.lastname.length < 2) newErrors.lastname = 'Last name must be at least 2 characters';
    // Email
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    // Phone
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Please enter a valid phone number';
    // Clinic Name
    if (!formData.clinicName.trim()) newErrors.clinicName = 'Clinic name is required';
    else if (formData.clinicName.length < 3) newErrors.clinicName = 'Clinic name must be at least 3 characters';
    // Clinic License Number
    if (!formData.clinicLicenseNumber.trim()) newErrors.clinicLicenseNumber = 'Clinic license number is required';
    else if (formData.clinicLicenseNumber.length < 5) newErrors.clinicLicenseNumber = 'License number must be at least 5 characters';
    // GST Number
    if (!formData.gstNumber.trim()) newErrors.gstNumber = 'GST number is required';
    else if (!gstRegex.test(formData.gstNumber.toUpperCase())) newErrors.gstNumber = 'Please enter a valid GST number (22AAAAA0000A1Z5)';
    // PAN Number
    if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';
    else if (!panRegex.test(formData.panNumber.toUpperCase())) newErrors.panNumber = 'Please enter a valid PAN number (AAAAA0000A)';
    // Billing Address
    if (!formData.address.trim()) newErrors.address = 'Billing address is required';
    else if (formData.address.length < 10) newErrors.address = 'Billing address must be at least 10 characters';
    // Password
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    // Confirm Password
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'billingSameAsClinic') {
      setBillingSameAsClinic(checked);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormErrors]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const { confirmPassword, ...clinicData } = formData;
      const result = await register(clinicData).unwrap();
      // If registration returns a token, store it
      if (result && result.token) {
        localStorage.setItem('doctor_access_token', result.token);
      }
      toast({
        title: 'Registration Successful!',
        description: 'Your clinic has been registered successfully. You are now logged in.',
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: (error as any).message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Register Your Clinic</CardTitle>
          <CardDescription>
            Create your clinic account to get started with our dental lab management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name *</Label>
                <Input id="firstname" name="firstname" type="text" value={formData.firstname} onChange={handleInputChange} placeholder="Enter your first name" className={errors.firstname ? 'border-red-500' : ''} />
                {errors.firstname && <p className="text-sm text-red-500">{errors.firstname}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name *</Label>
                <Input id="lastname" name="lastname" type="text" value={formData.lastname} onChange={handleInputChange} placeholder="Enter your last name" className={errors.lastname ? 'border-red-500' : ''} />
                {errors.lastname && <p className="text-sm text-red-500">{errors.lastname}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email address" className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" className={errors.phone ? 'border-red-500' : ''} />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Clinic Information */}
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name *</Label>
              <Input id="clinicName" name="clinicName" type="text" value={formData.clinicName} onChange={handleInputChange} placeholder="Enter your clinic name" className={errors.clinicName ? 'border-red-500' : ''} />
              {errors.clinicName && <p className="text-sm text-red-500">{errors.clinicName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicLicenseNumber">Clinic License Number *</Label>
              <Input id="clinicLicenseNumber" name="clinicLicenseNumber" type="text" value={formData.clinicLicenseNumber} onChange={handleInputChange} placeholder="Enter your clinic license number" className={errors.clinicLicenseNumber ? 'border-red-500' : ''} />
              {errors.clinicLicenseNumber && <p className="text-sm text-red-500">{errors.clinicLicenseNumber}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number *</Label>
                <Input id="gstNumber" name="gstNumber" type="text" value={formData.gstNumber} onChange={handleInputChange} placeholder="e.g., 22AAAAA0000A1Z5" className={errors.gstNumber ? 'border-red-500' : ''} />
                {errors.gstNumber && <p className="text-sm text-red-500">{errors.gstNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input id="panNumber" name="panNumber" type="text" value={formData.panNumber} onChange={handleInputChange} placeholder="e.g., ABCDE1234F" className={errors.panNumber ? 'border-red-500' : ''} />
                {errors.panNumber && <p className="text-sm text-red-500">{errors.panNumber}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Billing Address *</Label>
              <Input id="address" name="address" type="text" value={formData.address} onChange={handleInputChange} placeholder="Enter your billing address" className={errors.address ? 'border-red-500' : ''} />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
            {/* Clinic Address Details */}
            <div className="pt-4"><h3 className="font-semibold">Clinic Address Details</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicAddressLine1">Address Line 1</Label>
                <Input id="clinicAddressLine1" name="clinicAddressLine1" type="text" value={formData.clinicAddressLine1} onChange={handleInputChange} placeholder="Clinic address line 1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicAddressLine2">Address Line 2</Label>
                <Input id="clinicAddressLine2" name="clinicAddressLine2" type="text" value={formData.clinicAddressLine2} onChange={handleInputChange} placeholder="Clinic address line 2 (optional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicCity">City</Label>
                <Input id="clinicCity" name="clinicCity" type="text" value={formData.clinicCity} onChange={handleInputChange} placeholder="Clinic city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicState">State</Label>
                <Input id="clinicState" name="clinicState" type="text" value={formData.clinicState} onChange={handleInputChange} placeholder="Clinic state" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicPincode">Pincode</Label>
                <Input id="clinicPincode" name="clinicPincode" type="text" value={formData.clinicPincode} onChange={handleInputChange} placeholder="Clinic pincode" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinicCountry">Country</Label>
                <Input id="clinicCountry" name="clinicCountry" type="text" value={formData.clinicCountry} onChange={handleInputChange} placeholder="Clinic country" />
              </div>
            </div>
            {/* Billing Address Same as Clinic Checkbox */}
            <div className="flex items-center space-x-2 mt-2 mb-2">
              <input
                type="checkbox"
                id="billingSameAsClinic"
                name="billingSameAsClinic"
                checked={billingSameAsClinic}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <Label htmlFor="billingSameAsClinic" className="text-sm text-muted-foreground cursor-pointer">
                Billing address is same as clinic address
              </Label>
            </div>
            {/* Billing Address Details */}
            <div className="pt-4"><h3 className="font-semibold">Billing Address Details</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingAddressLine1">Address Line 1</Label>
                <Input id="billingAddressLine1" name="billingAddressLine1" type="text" value={formData.billingAddressLine1} onChange={handleInputChange} placeholder="Billing address line 1" disabled={billingSameAsClinic} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingAddressLine2">Address Line 2</Label>
                <Input id="billingAddressLine2" name="billingAddressLine2" type="text" value={formData.billingAddressLine2} onChange={handleInputChange} placeholder="Billing address line 2 (optional)" disabled={billingSameAsClinic} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCity">City</Label>
                <Input id="billingCity" name="billingCity" type="text" value={formData.billingCity} onChange={handleInputChange} placeholder="Billing city" disabled={billingSameAsClinic} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingState">State</Label>
                <Input id="billingState" name="billingState" type="text" value={formData.billingState} onChange={handleInputChange} placeholder="Billing state" disabled={billingSameAsClinic} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPincode">Pincode</Label>
                <Input id="billingPincode" name="billingPincode" type="text" value={formData.billingPincode} onChange={handleInputChange} placeholder="Billing pincode" disabled={billingSameAsClinic} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCountry">Country</Label>
                <Input id="billingCountry" name="billingCountry" type="text" value={formData.billingCountry} onChange={handleInputChange} placeholder="Billing country" disabled={billingSameAsClinic} />
              </div>
            </div>
            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} placeholder="Enter your password" className={errors.password ? 'border-red-500 pr-10' : 'pr-10'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password" className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registering...</>) : ('Register Clinic')}</Button>
            <div className="text-center">
              <p className="text-sm text-gray-600">Already have an account?{' '}<a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Sign in here</a></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;