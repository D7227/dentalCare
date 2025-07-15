import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLoginMutation } from '@/store/slices/doctorAuthApi';
import { fetchUserDataFromToken } from '@/store/slices/userDataSlice';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const UserData = useAppSelector((state) => state.userData);
  const user = UserData.userData;
  console.log(user , "user data")
  // Redirect if already logged in and userData is present
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || !password) return;
    try {
      // Login API expects { email, password }
      const loginPayload = { mobileNumber: mobileNumber, password };
      const response = await login(loginPayload).unwrap();
      // Get token from response or localStorage
      const token = response?.token || localStorage.getItem('doctor_access_token');
      if (token) {
        dispatch(fetchUserDataFromToken(token));
      }
    } catch (error) {
      // Error handled by loginError
    }
  };

  const isLoading = isLoginLoading;
  const error = (loginError && 'data' in loginError && (loginError.data as any)?.message) || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your mobile number and password to access your account
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#11AB93] hover:bg-[#11AB93]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
