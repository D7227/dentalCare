import DepartmentHeadLayout from "@/DepartmentHeadScreen/DepartmentHeadLayout";
import DepartmentHeadLogin from "@/DepartmentHeadScreen/authentication/departmentHeadLogin";
import DashboardPage from "@/DepartmentHeadScreen/pages/DashboardPage";
import TechniciansPage from "@/DepartmentHeadScreen/pages/TechniciansPage";
import { selectDepartmentHeadToken } from "@/store/slices/departmentHeadSlice/departmentHeadSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    element: <DepartmentHeadLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "technicians",
        element: (
          <ProtectedRoute>
            <TechniciansPage />
          </ProtectedRoute>
        ),
      },
      // { path: "place-order", element: <PlaceOrder /> },
    ],
  },
];
