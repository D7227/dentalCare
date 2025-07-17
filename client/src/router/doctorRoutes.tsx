import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DoctorDashboard from "@/doctor/pages/DoctorDashboard";
import PlaceOrder from "@/pages/PlaceOrder";
import OrderDetails from "@/pages/OrderDetails";
import ResubmitOrder from "@/pages/ResubmitOrder";
import { useAppSelector } from "@/store/hooks";

const DoctorRouter = () => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem("token");
        return Boolean(token);
    });

    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(Boolean(token));
        };
        window.addEventListener("storage", handleAuthChange);
        window.addEventListener("authChanged", handleAuthChange);
        return () => {
            window.removeEventListener("storage", handleAuthChange);
            window.removeEventListener("authChanged", handleAuthChange);
        };
    }, []);

    // If not authenticated and not already on /login, redirect to /login
    if (!isAuthenticated && location.pathname !== "/login") {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated and on /login, redirect to dashboard
    if (isAuthenticated && location.pathname === "/login") {
        return <Navigate to="/" replace />;
    }

    // If authenticated and not on /login, render the dashboard/children
    if (isAuthenticated) {
        return <Outlet />;
    }

    // If not authenticated and on /login, let the login page render
    return null;
};

export default DoctorRouter;

export const doctorRoutes = [
    {
        path: "/",
        element: <DoctorRouter />,
        children: [
            { index: true, element: <DoctorDashboard /> },
            { path: "place-order", element: <PlaceOrder /> },
            { path: "resubmit-order/:orderId", element: <ResubmitOrder /> },
        ],
    },
];
