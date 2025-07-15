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

const router = createBrowserRouter([
  ...doctorRoutes,
  ...qaRoutes,
  { path: "/login", element: <Login /> },
  { path: "/qa/login", element: <p>qa login page</p> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SocketProvider>
          <RouterProvider router={router}></RouterProvider>
        </SocketProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;