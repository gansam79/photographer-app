import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { Plus, Trash2, Download, DollarSign } from "lucide-react";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "Bank Transfer",
    transactionId: "",
    notes: "",
  });
  const [payments, setPayments] = useState({});

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (!response.ok) throw new Error("Failed to fetch invoices");
      const data = await response.json();
      setInvoices(data);

      // Fetch payments for each invoice
      data.forEach((invoice) => {
        fetchPayments(invoice._id);
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (invoiceId) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/payments`);
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments((prev) => ({
        ...prev,
        [invoiceId]: data,
      }));
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete invoice");
      fetchInvoices();
      toast.success("Invoice deleted successfully");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Error deleting invoice");
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice || !paymentData.amount) {
      alert("Please enter payment amount");
      return;
    }

    try {
      const response = await fetch(
        `/api/invoices/${selectedInvoice._id}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(paymentData.amount),
            paymentMethod: paymentData.paymentMethod,
            transactionId: paymentData.transactionId,
            notes: paymentData.notes,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to record payment");
      fetchInvoices();
      setShowPaymentForm(false);
      setPaymentData({
        amount: "",
        paymentMethod: "Bank Transfer",
        transactionId: "",
        notes: "",
      });
      toast.success("Payment recorded successfully!");
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Error recording payment");
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.clientId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || inv.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Partially Paid":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.Unpaid;
  };

  const calculateTotalReceived = (invoiceId) => {
    const invoicePayments = payments[invoiceId] || [];
    return invoicePayments.reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gold-50 dark:bg-charcoal-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="luxury-text-title mb-2">Invoices</h1>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300">
              Track and manage all invoices and payments
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="luxury-card">
            <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
              Total Invoiced
            </p>
            <p className="font-playfair text-2xl font-bold text-charcoal-900 dark:text-white">
              ₹
              {invoices
                .reduce((sum, inv) => sum + inv.grandTotal, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="luxury-card">
            <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
              Total Received
            </p>
            <p className="font-playfair text-2xl font-bold text-green-600">
              ₹
              {invoices
                .reduce((sum, inv) => sum + calculateTotalReceived(inv._id), 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="luxury-card">
            <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
              Pending Amount
            </p>
            <p className="font-playfair text-2xl font-bold text-red-600">
              ₹
              {invoices
                .reduce(
                  (sum, inv) =>
                    sum + (inv.grandTotal - calculateTotalReceived(inv._id)),
                  0,
                )
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by client name or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded font-montserrat text-charcoal-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block">
              <DollarSign className="w-8 h-8 text-gold-500" />
            </div>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400 mt-4">
              Loading invoices...
            </p>
          </div>
        ) : filteredInvoices.length === 0 &&
          searchTerm === "" &&
          filterStatus === "All" ? (
          <div className="luxury-card text-center py-16">
            <DollarSign className="w-16 h-16 text-gold-300 mx-auto mb-4" />
            <h2 className="luxury-text-subtitle text-xl mb-2">
              No Invoices Yet
            </h2>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400 mb-6">
              Create invoices from quotations or add new ones directly
            </p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="luxury-card text-center py-8">
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
              No invoices found matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredInvoices.map((invoice) => {
              const totalReceived = calculateTotalReceived(invoice._id);
              const pending = invoice.grandTotal - totalReceived;
              const invoicePayments = payments[invoice._id] || [];

              return (
                <div key={invoice._id} className="luxury-card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-playfair text-lg font-semibold text-charcoal-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(
                            invoice.paymentStatus,
                          )}`}
                        >
                          {invoice.paymentStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
                            Client
                          </p>
                          <p className="font-montserrat font-semibold text-charcoal-900 dark:text-white">
                            {invoice.clientId.name}
                          </p>
                        </div>
                        <div>
                          <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
                            Grand Total
                          </p>
                          <p className="font-montserrat font-bold text-gold-600">
                            ₹{invoice.grandTotal.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
                            Received
                          </p>
                          <p className="font-montserrat font-bold text-green-600">
                            ₹{totalReceived.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
                            Pending
                          </p>
                          <p className="font-montserrat font-bold text-red-600">
                            ₹{pending.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {invoicePayments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gold-200 dark:border-charcoal-700">
                          <p className="font-montserrat font-semibold text-charcoal-900 dark:text-white mb-2">
                            Payment History:
                          </p>
                          <div className="space-y-2">
                            {invoicePayments.map((payment, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm font-montserrat"
                              >
                                <div>
                                  <span className="text-charcoal-600 dark:text-charcoal-400">
                                    {payment.paymentMethod} -{" "}
                                    {new Date(
                                      payment.paymentDate,
                                    ).toLocaleDateString()}
                                  </span>
                                  {payment.transactionId && (
                                    <p className="text-charcoal-500 dark:text-charcoal-400 text-xs">
                                      ID: {payment.transactionId}
                                    </p>
                                  )}
                                </div>
                                <span className="text-green-600 font-semibold">
                                  ₹{payment.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() =>
                          generateInvoicePDF(invoice, invoice.clientId)
                        }
                        className="p-2 hover:bg-purple-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5 text-purple-600" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowPaymentForm(true);
                        }}
                        className="p-2 hover:bg-green-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                        title="Record payment"
                      >
                        <Plus className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice._id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gold-200 dark:border-charcoal-700">
              <h2 className="font-playfair text-2xl font-bold text-charcoal-900 dark:text-white">
                Record Payment
              </h2>
              <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400 mt-1">
                {selectedInvoice.invoiceNumber} - ₹
                {(
                  selectedInvoice.grandTotal -
                  calculateTotalReceived(selectedInvoice._id)
                ).toLocaleString()}{" "}
                pending
              </p>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block font-montserrat font-semibold text-charcoal-900 dark:text-white mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-charcoal-900 dark:text-white mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      paymentMethod: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-charcoal-900 dark:text-white mb-2">
                  Transaction ID (optional)
                </label>
                <input
                  type="text"
                  value={paymentData.transactionId}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      transactionId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
                  placeholder="Reference number"
                />
              </div>

              <div>
                <label className="block font-montserrat font-semibold text-charcoal-900 dark:text-white mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows="2"
                  className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
                  placeholder="Add any notes"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-semibold rounded transition-colors"
                >
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedInvoice(null);
                    setPaymentData({
                      amount: "",
                      paymentMethod: "Bank Transfer",
                      transactionId: "",
                      notes: "",
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-gold-500 text-gold-600 hover:bg-gold-50 dark:hover:bg-charcoal-700 font-montserrat font-semibold rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
