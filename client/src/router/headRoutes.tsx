import HeadDashboard from "@/headScreen/headDashboard";
import PlaceOrder from "@/pages/PlaceOrder";
import QaDashboard from "@/qaScreen/screen/QaDashboard";
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
