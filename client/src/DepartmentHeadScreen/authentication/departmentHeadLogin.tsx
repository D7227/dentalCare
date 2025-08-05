import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginDepartmentHeadMutation } from "@/store/slices/departmentHeadSlice/departmentHeadApi";
import { selectDepartmentHeadToken } from "@/store/slices/departmentHeadSlice/departmentHeadSlice";

const DepartmentHeadLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const departmentHeadToken = useSelector(selectDepartmentHeadToken);

  const [login, { isLoading, error }] = useLoginDepartmentHeadMutation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token =
      departmentHeadToken || localStorage.getItem("department-head-token");
    if (token) {
      navigate("/department-head");
    }
  }, [departmentHeadToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    try {
      await login({ email, password }).unwrap();
      navigate("/department-head");
    } catch (err: any) {
      setFormError(err?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Department Head Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the department management portal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
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

              {(formError ||
                (error && "data" in error && (error as any).data?.error)) && (
                <div className="text-red-600 text-sm text-center">
                  {formError ||
                    (error && "data" in error && (error as any).data?.error)}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentHeadLogin;
