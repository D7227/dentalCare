import HeadDashboard from "@/adminScreen/adminDashboard";
import React from "react";
import { Outlet } from "react-router-dom";

export const headRoutes = [
  {
    path: "/head",
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      { index: true, element: <HeadDashboard /> },
    ],
  },
];
