import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import {
  FileText,
  CreditCard,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBilled: 0,
    totalReceived: 0,
    pendingPayments: 0,
    quotationsSent: 0,
    totalClients: 0,
  });
  const [recentQuotations, setRecentQuotations] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [quotationsRes, invoicesRes, clientsRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/invoices"),
        fetch("/api/clients"),
      ]);

      const quotations = await quotationsRes.json();
      const invoices = await invoicesRes.json();
      const clients = await clientsRes.json();

      // Calculate totals
      const totalBilled = invoices.reduce(
        (sum, inv) => sum + inv.grandTotal,
        0,
      );

      // Calculate total received
      let totalReceived = 0;
      let pendingPayments = 0;

      for (const invoice of invoices) {
        const paymentsRes = await fetch(
          `/api/invoices/${invoice._id}/payments`,
        );
        const payments = await paymentsRes.json();
        const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        totalReceived += amountPaid;
        pendingPayments += Math.max(0, invoice.grandTotal - amountPaid);
      }

      setStats({
        totalBilled,
        totalReceived,
        pendingPayments,
        quotationsSent: quotations.length,
        totalClients: clients.length,
      });

      // Get recent quotations (last 3)
      setRecentQuotations(quotations.slice(0, 3));

      // Get recent invoices (last 3)
      setRecentInvoices(invoices.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, isPositive }) => (
    <div className="luxury-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300 text-sm mb-1">
            {label}
          </p>
          <p className="font-playfair text-2xl font-bold text-charcoal-900 dark:text-white">
            {(typeof value === "number" && label.includes("Pending")) ||
            label.includes("Quotations")
              ? value.toLocaleString()
              : `₹${value.toLocaleString()}`}
          </p>
        </div>
        <div className="w-12 h-12 bg-gold-100 dark:bg-charcoal-700 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gold-600" />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-3 text-sm">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
          )}
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {change}%
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gold-50 dark:bg-charcoal-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="luxury-text-title mb-2">Dashboard</h1>
          <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300">
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={CreditCard}
            label="Total Billed"
            value={stats.totalBilled}
            change={12}
            isPositive={true}
          />
          <StatCard
            icon={TrendingUp}
            label="Total Received"
            value={stats.totalReceived}
            change={8}
            isPositive={true}
          />
          <StatCard
            icon={FileText}
            label="Pending Payments"
            value={stats.pendingPayments}
            change={-3}
            isPositive={false}
          />
          <StatCard
            icon={FileText}
            label="Quotations Sent"
            value={stats.quotationsSent}
            change={5}
            isPositive={true}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Quotations */}
          <div className="luxury-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="luxury-text-subtitle text-xl">
                Recent Quotations
              </h2>
              <Link
                to="/quotations"
                className="text-gold-600 hover:text-gold-700 font-montserrat text-sm"
              >
                View All →
              </Link>
            </div>
            {loading ? (
              <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
                Loading...
              </p>
            ) : recentQuotations.length === 0 ? (
              <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
                No quotations yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentQuotations.map((quotation, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-3 border-b border-gold-100 dark:border-charcoal-700"
                  >
                    <div>
                      <p className="font-montserrat font-medium text-charcoal-900 dark:text-white">
                        {quotation.clientId?.name || "Unknown Client"}
                      </p>
                      <p className="font-montserrat text-sm text-charcoal-500 dark:text-charcoal-400">
                        {new Date(quotation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-montserrat font-semibold text-gold-600">
                      ₹{quotation.grandTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="luxury-card">
            <h2 className="luxury-text-subtitle text-xl mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/quotations"
                className="block w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-medium rounded transition-colors text-center"
              >
                + Create New Quotation
              </Link>
              <Link
                to="/invoices"
                className="block w-full px-4 py-3 bg-charcoal-700 hover:bg-charcoal-800 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-white font-montserrat font-medium rounded transition-colors text-center"
              >
                + Create New Invoice
              </Link>
              <Link
                to="/clients"
                className="block w-full px-4 py-3 border-2 border-gold-500 text-gold-600 hover:bg-gold-50 dark:hover:bg-charcoal-800 font-montserrat font-medium rounded transition-colors text-center"
              >
                + Add New Client
              </Link>
            </div>
            <div className="mt-6 p-4 bg-gold-50 dark:bg-charcoal-800 rounded border border-gold-200 dark:border-charcoal-700">
              <p className="font-montserrat text-sm text-charcoal-700 dark:text-charcoal-300">
                <span className="font-semibold">Tip:</span> Use keyboard
                shortcuts to quickly create new documents. Press{" "}
                <kbd className="px-2 py-1 bg-white dark:bg-charcoal-700 border border-gold-200 dark:border-charcoal-600 rounded text-xs font-mono">
                  Ctrl+Q
                </kbd>{" "}
                for quotations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
            <span className="text-gold-600 font-semibold">
              The Patil Photography & Film's
            </span>{" "}
            • Crafting beautiful moments, flawlessly documented
          </p>
        </div>
      </main>
    </div>
  );
}
