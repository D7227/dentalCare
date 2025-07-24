import AdminDashboard from "@/adminScreen/adminDashboard";
import React from "react";
import { Outlet } from "react-router-dom";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
    ],
  },
];
