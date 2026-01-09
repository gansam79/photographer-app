import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminGallery from "./pages/AdminGallery";
import AdminUsers from "./pages/AdminUsers";
import AdminSlider from "./pages/AdminSlider";
import AdminClients from "./pages/AdminClients";
import AdminInvoices from "./pages/AdminInvoices";
import AdminQuotations from "./pages/AdminQuotations";
import AccessoriesManagement from "./pages/AccessoriesManagement";
import AdminRegister from "./pages/AdminRegister";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Navigation />
            <main style={{ flex: 1, padding: 20 }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quotations" element={<Quotations />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/clients" element={<Clients />} />

                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/gallery" element={<AdminGallery />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/slider" element={<AdminSlider />} />
                <Route path="/admin/clients" element={<AdminClients />} />
                <Route path="/admin/invoices" element={<AdminInvoices />} />
                <Route path="/admin/quotations" element={<AdminQuotations />} />
                <Route path="/accessories" element={<AccessoriesManagement />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/profile" element={<UserProfile />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
