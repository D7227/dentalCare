import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginMutation } from '@/store/slices/doctorAuthApi';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const navigate = useNavigate()

  const [login, { isLoading, error, data }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (data && data.token) {
      // You can store the token or redirect here
      // localStorage.setItem('token', data.token);
      setLocation('/');
    }
  }, [data, setLocation]);

  console.log('data', data, error)

  if (data) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!mobileNumber || !password) {
      setFormError('Mobile number and password are required');
      return;
    }
    try {
      await login({ mobileNumber, password });
      navigate('/');
    } catch (err: any) {
      setFormError(err?.data?.error || 'Login failed');
    }
  };

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

              {(formError || (error && 'data' in error && (error as any).data?.error)) && (
                <div className="text-red-600 text-sm text-center">
                  {formError || (error && 'data' in error && (error as any).data?.error)}
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
