import "./global.css";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const AppShell = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation isMobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-charcoal-900"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
            Menu
          </button>
          <span className="text-sm font-semibold text-charcoal-900">Studio Console</span>
        </div>
        <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
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
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
