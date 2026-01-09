import { useState, useEffect } from "react";
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
    <div>
      <div className="mb-6">
        <h1 className="luxury-text-title mb-2">Dashboard</h1>
        <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300">
          Welcome back! Here's your business overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="luxury-card">Total Billed: ₹{stats.totalBilled}</div>
        <div className="luxury-card">Total Received: ₹{stats.totalReceived}</div>
        <div className="luxury-card">Pending Payments: ₹{stats.pendingPayments}</div>
        <div className="luxury-card">Quotations Sent: {stats.quotationsSent}</div>
      </div>
    </div>
  );
}
