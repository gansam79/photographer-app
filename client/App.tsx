import "./global.css";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Quotations from "./pages/Quotations";
import Invoices from "./pages/Invoices";
import Clients from "./pages/Clients";
import AdminOrders from "./pages/AdminOrders";
import AdminGallery from "./pages/AdminGallery";
import AdminUsers from "./pages/AdminUsers";
import AdminSlider from "./pages/AdminSlider";
import AdminClients from "./pages/AdminClients";
import AdminInvoices from "./pages/AdminInvoices";
import AdminQuotations from "./pages/AdminQuotations";
import AdminFilms from "./pages/AdminFilms";
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
        <BrowserRouter basename="/admin" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const AppShell = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  console.log("ROUTER DEBUG: Path:", location.pathname);
  const isLoginRoute = location.pathname === "/" || location.pathname === "/login";

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className={isLoginRoute ? "min-h-screen bg-slate-50" : "flex min-h-screen bg-slate-50"}>
      {!isLoginRoute && <Navigation isMobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />}
      <div className={isLoginRoute ? "w-full" : "flex min-h-screen flex-1 flex-col"}>
        {!isLoginRoute && (
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
        )}
        <main
          className={
            isLoginRoute
              ? "flex min-h-screen items-center justify-center px-4 py-10"
              : "flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10"
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/clients" element={<Clients />} />

            {/* Admin Modules */}
            <Route path="/films" element={<AdminFilms />} />
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
