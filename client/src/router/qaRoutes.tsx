import PlaceOrder from "@/pages/PlaceOrder";
import QaDashboard from "@/qaScreen/screen/QaDashboard";
import React from "react";
import { Outlet } from "react-router-dom";

export const qaRoutes = [
  {
    path: "/qa",
    element: (
      <div>
        <Outlet />
      </div>
    ),
    children: [
      { index: true, element: <QaDashboard /> },
      { path: "place-order", element: <PlaceOrder /> },
    ],
  },
];
