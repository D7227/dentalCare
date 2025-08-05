import DepartmentHeadDashboard from "@/DepartmentHeadScreen/departmentHeadDashboard";
import DepartmentHeadLogin from "@/DepartmentHeadScreen/authentication/departmentHeadLogin";
import PlaceOrder from "@/pages/PlaceOrder";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectDepartmentHeadToken } from "@/store/slices/departmentHeadSlice/departmentHeadSlice";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const departmentHeadToken = useSelector(selectDepartmentHeadToken);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token =
      departmentHeadToken || localStorage.getItem("department-head-token");

    if (!token) {
      navigate("/department-head/login", { replace: true });
      return;
    }
    setIsLoading(false);
  }, [navigate, departmentHeadToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const token =
    departmentHeadToken || localStorage.getItem("department-head-token");
  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export const departmentHeadRoutes = [
  {
    path: "/department-head",
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: "login",
        element: <DepartmentHeadLogin />,
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DepartmentHeadDashboard />
          </ProtectedRoute>
        ),
      },
      // { path: "place-order", element: <PlaceOrder /> },
    ],
  },
];
