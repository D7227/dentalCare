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
import { registerClinic, clearError } from '@/store/slices/authSlice';

interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  clinicName: string;
  clinicLicenseNumber: string;
  clinicAddress: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    clinicName: '',
    clinicLicenseNumber: '',
    clinicAddress: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  // Clear error when component mounts or error changes
  React.useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // First Name validation
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    } else if (formData.firstname.length < 2) {
      newErrors.firstname = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    } else if (formData.lastname.length < 2) {
      newErrors.lastname = 'Last name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Clinic Name validation
    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'Clinic name is required';
    } else if (formData.clinicName.length < 3) {
      newErrors.clinicName = 'Clinic name must be at least 3 characters';
    }

    // Clinic License Number validation
    if (!formData.clinicLicenseNumber.trim()) {
      newErrors.clinicLicenseNumber = 'Clinic license number is required';
    } else if (formData.clinicLicenseNumber.length < 5) {
      newErrors.clinicLicenseNumber = 'License number must be at least 5 characters';
    }

    // Clinic Address validation
    if (!formData.clinicAddress.trim()) {
      newErrors.clinicAddress = 'Clinic address is required';
    } else if (formData.clinicAddress.length < 10) {
      newErrors.clinicAddress = 'Clinic address must be at least 10 characters';
    }

    // GST Number validation
    // const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST number is required';
    } 
    // else if (!gstRegex.test(formData.gstNumber.toUpperCase())) {
    //   newErrors.gstNumber = 'Please enter a valid GST number';
    // }

    // PAN Number validation
    // const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN number is required';
    } 
    // else if (!panRegex.test(formData.panNumber.toUpperCase())) {
    //   newErrors.panNumber = 'Please enter a valid PAN number';
    // }

    // Billing Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Billing address is required';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Billing address must be at least 10 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const clinicData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        clinicName: formData.clinicName,
        clinicLicenseNumber: formData.clinicLicenseNumber,
        clinicAddress: formData.clinicAddress,
        gstNumber: formData.gstNumber.toUpperCase(),
        panNumber: formData.panNumber.toUpperCase(),
        address: formData.address,
        password: formData.password,
        roleId: '2411f233-1e48-43ae-9af9-6d5ce0569278', // Static UUID for clinic role
        permissions: [
          "scan_booking",
          "tracking", 
          "pickup_requests",
          "chat",
          "all_patients",
          "billing"
        ]
      };

      const userResult = await dispatch(registerClinic(clinicData)).unwrap();
      
      toast({
        title: "Registration Successful!",
        description: "Your clinic has been registered successfully. You are now logged in.",
      });
      
      // User is automatically logged in after registration, redirect to dashboard
      setLocation('/');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
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
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={errors.firstname ? 'border-red-500' : ''}
                />
                {errors.firstname && (
                  <p className="text-sm text-red-500">{errors.firstname}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name *</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={errors.lastname ? 'border-red-500' : ''}
                />
                {errors.lastname && (
                  <p className="text-sm text-red-500">{errors.lastname}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Clinic Information */}
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name *</Label>
              <Input
                id="clinicName"
                name="clinicName"
                type="text"
                value={formData.clinicName}
                onChange={handleInputChange}
                placeholder="Enter your clinic name"
                className={errors.clinicName ? 'border-red-500' : ''}
              />
              {errors.clinicName && (
                <p className="text-sm text-red-500">{errors.clinicName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicLicenseNumber">Clinic License Number *</Label>
              <Input
                id="clinicLicenseNumber"
                name="clinicLicenseNumber"
                type="text"
                value={formData.clinicLicenseNumber}
                onChange={handleInputChange}
                placeholder="Enter your clinic license number"
                className={errors.clinicLicenseNumber ? 'border-red-500' : ''}
              />
              {errors.clinicLicenseNumber && (
                <p className="text-sm text-red-500">{errors.clinicLicenseNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicAddress">Clinic Address *</Label>
              <Input
                id="clinicAddress"
                name="clinicAddress"
                type="text"
                value={formData.clinicAddress}
                onChange={handleInputChange}
                placeholder="Enter your clinic address"
                className={errors.clinicAddress ? 'border-red-500' : ''}
              />
              {errors.clinicAddress && (
                <p className="text-sm text-red-500">{errors.clinicAddress}</p>
              )}
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number *</Label>
                <Input
                  id="gstNumber"
                  name="gstNumber"
                  type="text"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 22AAAAA0000A1Z5"
                  className={errors.gstNumber ? 'border-red-500' : ''}
                />
                {errors.gstNumber && (
                  <p className="text-sm text-red-500">{errors.gstNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  name="panNumber"
                  type="text"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., ABCDE1234F"
                  className={errors.panNumber ? 'border-red-500' : ''}
                />
                {errors.panNumber && (
                  <p className="text-sm text-red-500">{errors.panNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Billing Address *</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your billing address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Clinic'
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;