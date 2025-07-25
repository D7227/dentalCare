import DepartmentHeadDashboard from "@/DepartmentHeadScreen/departmentHeadDashboard";
import PlaceOrder from "@/pages/PlaceOrder";
import React from "react";
import { Outlet } from "react-router-dom";

export const departmentHeadRoutes = [
  {
    path: "/department-head",
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      { index: true, element: <DepartmentHeadDashboard /> },
      // { path: "place-order", element: <PlaceOrder /> },
    ],
  },
];
