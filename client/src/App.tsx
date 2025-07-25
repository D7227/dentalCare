import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SocketProvider } from "@/contexts/SocketContext";
import NotFound from "./pages/NotFound";
import Login from "./pages/authentication/login";
import Register from "./pages/authentication/register";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { doctorRoutes } from "./router/doctorRoutes";
import { qaRoutes } from "./router/qaRoutes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { chatApi } from "@/store/slices/chatApi";
import { useSocket } from "@/contexts/SocketContext";
import { useGetUserDataQuery, setUser } from "./store/slices/userDataSlice";
import { jwtDecode } from "jwt-decode";
import { adminRoutes } from "./router/adminRoutes";
import QALogin from "./qaScreen/screen/authentication/qaLogin";
import { departmentHeadRoutes } from "./router/departmentHeadRoutes";

const router = createBrowserRouter([
  ...doctorRoutes,
  ...qaRoutes,
  ...adminRoutes,
  ...departmentHeadRoutes,
  { path: "/login", element: <Login /> },
  { path: "/qa/login", element: <QALogin /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> },
]);

// SocketEventsListener component to handle socket events within the provider
const SocketEventsListener = () => {
  const dispatch = useDispatch();
  const { getSocket } = useSocket();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (data: any) => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
      if (data?.chatId) {
        dispatch(
          chatApi.util.invalidateTags([{ type: "Message", id: data.chatId }])
        );
      }
    };
    const handleUnreadCountUpdate = (data: any) => {
      dispatch(chatApi.util.invalidateTags(["Chat"]));
    };
    socket.on("new-message", handleNewMessage);
    socket.on("unread-count-update", handleUnreadCountUpdate);
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("unread-count-update", handleUnreadCountUpdate);
    };
  }, [getSocket, dispatch]);
  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  let userId: string | null = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.id;
    } catch (e) {
      userId = null;
    }
  }
  const queryResult = userId
    ? useGetUserDataQuery(userId)
    : { data: undefined, isSuccess: false };
  const { data: userData, isSuccess } = queryResult;

  useEffect(() => {
    if (isSuccess && userData) {
      dispatch(setUser(userData));
    }
  }, [isSuccess, userData, dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SocketProvider>
            <SocketEventsListener />
            <RouterProvider router={router}></RouterProvider>
          </SocketProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
