import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { Eye, FileText, Edit, Trash2, Download } from "lucide-react";

const emptyOrder = {
  name: "",
  whatsapp_no: "",
  email: "",
  event_name: "",
  photography_type: "",
  location: "",
  event_date: "",
  start_time: "",
  end_time: "",
  service: "",
  album_pages: "",
  amount: "",
  amount_paid: "",
  remaining_amount: "",
  deliverables: "",
  delivery_date: "",
  order_status: "Pending",
  notes: "",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState(emptyOrder);
  const [showDelete, setShowDelete] = useState(false);
  const [toDeleteOrder, setToDeleteOrder] = useState(null);
  const [showView, setShowView] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.order_status === "Delivered").length;
    const inProgress = orders.filter((o) => o.order_status === "In Progress").length;
    const pending = orders.filter((o) => o.order_status === "Pending").length;
    return { total, delivered, inProgress, pending };
  }, [orders]);

  const statusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "Cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditingOrder(null);
    setForm(emptyOrder);
    setShowForm(true);
  }

  function openEdit(order) {
    setEditingOrder(order);

    // Retrieve stashed data from serviceConfig if available (Legacy fallback)
    const stash = order.serviceConfig || {};

    // Normalize data from potentially old schema fields or the stash
    setForm({
      ...emptyOrder,
      ...order,
      name: order.name || order.customerName || stash.name || "",
      whatsapp_no: order.whatsapp_no || order.customerPhone || stash.whatsapp_no || "",
      email: order.email || stash.email || "",
      event_name: order.event_name || stash.event_name || "",
      location: order.location || stash.location || "",
      start_time: order.start_time || stash.start_time || "",
      end_time: order.end_time || stash.end_time || "",
      deliverables: order.deliverables || stash.deliverables || "",
      notes: order.notes || stash.notes || "",

      event_date: [order.event_date, order.date, stash.event_date].find(d => d)
        ? new Date(order.event_date || order.date || stash.event_date).toISOString().split("T")[0] : "",

      amount_paid: order.amount_paid ?? order.paidAmount ?? stash.amount_paid ?? "",
      remaining_amount: order.remaining_amount ?? stash.remaining_amount ?? "",

      order_status: order.order_status || order.status || stash.order_status || "Pending",
      photography_type: order.photography_type || order.photographyType || stash.photography_type || "",
      album_pages: order.album_pages || order.albumPages || stash.album_pages || "",
      service: order.service || stash.service || (Array.isArray(order.services) ? order.services.join(", ") : ""),

      delivery_date: (order.delivery_date || stash.delivery_date)
        ? new Date(order.delivery_date || stash.delivery_date).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === "amount" || name === "amount_paid") {
        const total = parseFloat(updated.amount) || 0;
        const paid = parseFloat(updated.amount_paid) || 0;
        updated.remaining_amount = total - paid;
      }
      return updated;
    });
  }

  async function saveOrder() {
    // basic validation
    if (!form.name || !form.whatsapp_no) {
      alert("Please provide name and WhatsApp number");
      return;
    }

    try {
      const method = editingOrder ? "PUT" : "POST";
      const url = editingOrder ? `/api/orders/${editingOrder._id}` : "/api/orders";

      // Sanitize payload: convert empty strings to null for specific types
      const payload = { ...form };

      // BACKWARD COMPATIBILITY: Map new fields to legacy fields so the server accepts them 
      if (payload.name) payload.customerName = payload.name;
      if (payload.whatsapp_no) payload.customerPhone = payload.whatsapp_no;
      if (payload.event_date) payload.date = payload.event_date;

      // Status Mapping
      const legacyStatusMap = {
        "In Progress": "Pending",
        "Delivered": "Completed"
      };
      if (payload.order_status) {
        payload.status = legacyStatusMap[payload.order_status] || payload.order_status;
      }
      if (payload.amount_paid) payload.paidAmount = payload.amount_paid;

      // CRITICAL: Pack all new fields into 'serviceConfig' (Mixed type in old schema)
      // This ensures they are saved to the DB even if the server schema is stale and strips top-level fields.
      payload.serviceConfig = {
        email: form.email,
        event_name: form.event_name,
        photography_type: form.photography_type,
        location: form.location,
        start_time: form.start_time,
        end_time: form.end_time,
        service: form.service,
        album_pages: form.album_pages,
        amount_paid: form.amount_paid,
        remaining_amount: form.remaining_amount,
        notes: form.notes,
        deliverables: form.deliverables,
        delivery_date: form.delivery_date,
        // Also stash core fields just in case
        name: form.name,
        whatsapp_no: form.whatsapp_no,
        order_status: form.order_status,
        event_date: form.event_date
      };

      if (payload.photography_type) payload.photographyType = payload.photography_type;
      if (payload.album_pages) payload.albumPages = payload.album_pages;

      // New schema uses 'service' string, old used 'services' array
      if (payload.service) payload.services = payload.service.split(',').map(s => s.trim());

      ['amount', 'amount_paid', 'remaining_amount', 'event_date', 'delivery_date', 'date', 'paidAmount'].forEach(field => {
        if (payload[field] === "") payload[field] = null;
      });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save order");
      }

      await fetchOrders();
      setShowForm(false);
      setEditingOrder(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function confirmDelete(order) {
    setToDeleteOrder(order);
    setShowDelete(true);
  }

  async function doDelete() {
    if (!toDeleteOrder) return;
    try {
      const res = await fetch(`/api/orders/${toDeleteOrder._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setShowDelete(false);
      setToDeleteOrder(null);
      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Could not delete order");
    }
  }

  // ... inside AdminOrders component ...

  function openView(order) {
    setViewOrder(order);
    setShowView(true);
  }

  function downloadReceipt(order) {
    const doc = new jsPDF();

    // Helper to add text
    const addText = (text, x, y, size = 12, font = "helvetica", style = "normal") => {
      doc.setFont(font, style);
      doc.setFontSize(size);
      doc.text(text, x, y);
    };

    // Header
    doc.setFillColor(218, 165, 32); // Gold color approximation
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);

    // Correct way to center text in jsPDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("PAYMENT RECEIPT", 105, 25, { align: "center" });

    // Reset
    doc.setTextColor(0, 0, 0);

    // Reset
    doc.setTextColor(0, 0, 0);

    const total = parseFloat(order.amount) || 0;
    const paid = parseFloat(order.amount_paid) || parseFloat(order.paidAmount) || 0;
    const remaining = total - paid;
    const dateStr = new Date().toLocaleDateString();

    let y = 60;

    // Order Info Box
    doc.setFontSize(10);
    doc.text(`Receipt Date: ${dateStr}`, 150, 50);
    doc.text(`Order ID: #${order._id.slice(-6).toUpperCase()}`, 150, 55);

    doc.setFontSize(14);
    doc.text(`Client: ${order.name || order.customerName}`, 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Event: ${order.event_name}`, 20, y);
    y += 10;
    const eventDate = order.event_date || order.date ? new Date(order.event_date || order.date).toLocaleDateString() : "N/A";
    doc.text(`Event Date: ${eventDate}`, 20, y);
    y += 10;
    doc.text(`Service: ${order.photography_type || order.photographyType || order.service || "-"}`, 20, y);

    y += 20;

    // Financial Table Look
    doc.setDrawColor(200);
    doc.line(20, y, 190, y); // Top line
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, y);
    doc.text("Amount", 160, y, { align: "right" });
    y += 5;
    doc.line(20, y, 190, y); // Header bottom line

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text("Total Project Value", 25, y);
    doc.text(`Rs. ${total.toLocaleString()}`, 160, y, { align: "right" });

    y += 10;
    doc.text("Amount Received", 25, y);
    doc.text(`Rs. ${paid.toLocaleString()}`, 160, y, { align: "right" });

    y += 5;
    doc.line(20, y, 190, y); // Bottom line

    y += 15;
    doc.setFont("helvetica", "bold");
    if (remaining > 0) {
      doc.text("Balance Due", 25, y);
      doc.text(`Rs. ${remaining.toLocaleString()}`, 160, y, { align: "right" });
    } else {
      doc.setTextColor(0, 150, 0);
      doc.text("Fully Paid", 25, y);
      doc.text("Rs. 0", 160, y, { align: "right" });
      doc.setTextColor(0, 0, 0);
    }

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing us to capture your memories!", 105, 270, { align: "center" });

    doc.save(`Receipt_${(order.name || "Order").replace(/\s+/g, '_')}_${dateStr}.pdf`);
  }
  const [photographyTypes, setPhotographyTypes] = useState(() => {
    const saved = localStorage.getItem("photographyTypes");
    return saved ? JSON.parse(saved) : ["Wedding", "Pre-Wedding", "Baby Shower", "Birthday", "Corporate"];
  });
  const [serviceTypes, setServiceTypes] = useState(() => {
    const saved = localStorage.getItem("serviceTypes");
    return saved ? JSON.parse(saved) : ["Cinematic", "Candid", "Traditional", "Drone"];
  });

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [newType, setNewType] = useState("");
  const [newService, setNewService] = useState("");

  function addNewType() {
    if (!newType.trim()) return;
    if (photographyTypes.includes(newType.trim())) {
      alert("Type already exists");
      return;
    }
    const updated = [...photographyTypes, newType.trim()];
    setPhotographyTypes(updated);
    localStorage.setItem("photographyTypes", JSON.stringify(updated));
    setForm((f) => ({ ...f, photography_type: newType.trim() }));
    setNewType("");
    setShowTypeModal(false);
  }

  function addNewService() {
    if (!newService.trim()) return;
    if (serviceTypes.includes(newService.trim())) {
      alert("Service already exists");
      return;
    }
    const updated = [...serviceTypes, newService.trim()];
    setServiceTypes(updated);
    localStorage.setItem("serviceTypes", JSON.stringify(updated));
    setNewService("");
    setShowServiceModal(false);
  }

  function handleServiceChange(e) {
    const { value, checked } = e.target;
    // Current services as array
    let current = form.service ? form.service.split(",").map(s => s.trim()).filter(Boolean) : [];

    if (checked) {
      if (!current.includes(value)) current.push(value);
    } else {
      current = current.filter(item => item !== value);
    }

    setForm(f => ({ ...f, service: current.join(", ") }));
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        {/* ... (keep existing header content) ... */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Production</p>
          <h1 className="text-3xl font-semibold text-charcoal-900 dark:text-white">Orders</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-300">
            Monitor bookings, payment progress, and delivery milestones.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gold-600"
          onClick={openAdd}
        >
          <span className="text-lg">+</span>
          Add Order
        </button>
      </header>

      {/* ... (keep existing summary cards and table) ... */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total" value={stats.total} accent="from-amber-100 to-white" />
        <SummaryCard label="In Progress" value={stats.inProgress} accent="from-blue-100 to-white" />
        <SummaryCard label="Pending" value={stats.pending} accent="from-orange-100 to-white" />
        <SummaryCard label="Delivered" value={stats.delivered} accent="from-emerald-100 to-white" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-charcoal-900">Manage Orders</h2>
          <p className="text-xs text-slate-500">Last updated {new Date().toLocaleDateString()}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Client</th>
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Remaining</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const total = parseFloat(order.amount) || 0;
                  const paid = parseFloat(order.amount_paid) || parseFloat(order.paidAmount) || 0;
                  const remaining = total - paid;

                  return (
                    <tr key={order._id} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-charcoal-900">{order.name || order.customerName}</td>
                      <td className="px-4 py-3">{order.event_name || "-"}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {order.event_date
                          ? new Date(order.event_date).toLocaleDateString()
                          : order.date ? new Date(order.date).toLocaleDateString() : "--"
                        }
                      </td>
                      <td className="px-4 py-3 font-medium text-charcoal-900">
                        {order.amount?.toLocaleString ? `₹${order.amount.toLocaleString()}` : order.amount}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {remaining > 0 ? `₹${remaining.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.order_status || order.status)}`}>
                          {order.order_status || order.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2 justify-end">
                          <button
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-gold-500"
                            onClick={() => openView(order)}
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                            onClick={() => downloadReceipt(order)}
                            title="Download Receipt"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-green-600"
                            onClick={() => openEdit(order)}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                            onClick={() => confirmDelete(order)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex flex-col w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Order</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">
                  {editingOrder ? "Edit Order" : "Add New Order"}
                </h2>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Name" required>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="WhatsApp No." required>
                  <input
                    name="whatsapp_no"
                    value={form.whatsapp_no}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Email">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Event Name">
                  <input
                    name="event_name"
                    value={form.event_name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Photography Type" required>
                  <div className="flex gap-2">
                    <select
                      name="photography_type"
                      value={form.photography_type}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white"
                    >
                      <option value="">Choose type</option>
                      {photographyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowTypeModal(true)}
                      className="shrink-0 rounded-lg border border-gold-200 bg-gold-50 px-3 text-gold-600 hover:bg-gold-100"
                      title="Add new type"
                    >
                      +
                    </button>
                  </div>
                </FormField>
                <FormField label="Location" required>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Date" required>
                  <input
                    type="date"
                    name="event_date"
                    value={form.event_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Start Time">
                    <input
                      type="time"
                      name="start_time"
                      value={form.start_time}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                  </FormField>
                  <FormField label="End Time">
                    <input
                      type="time"
                      name="end_time"
                      value={form.end_time}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                  </FormField>
                </div>
                <FormField label="Service" required>
                  <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                    <div className="flex flex-wrap gap-3">
                      {serviceTypes.map((svc) => (
                        <label key={svc} className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            value={svc}
                            checked={(form.service || "").split(", ").includes(svc)}
                            onChange={handleServiceChange}
                            className="h-4 w-4 rounded border-slate-300 text-gold-500 focus:ring-gold-500"
                          />
                          <span className="text-sm text-slate-700">{svc}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowServiceModal(true)}
                      className="mt-2 text-xs font-semibold text-gold-600 hover:text-gold-700"
                    >
                      + Add New Service
                    </button>
                  </div>
                </FormField>
                <FormField label="Album Pages" required>
                  <select
                    name="album_pages"
                    value={form.album_pages}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white"
                  >
                    <option value="">Choose pages</option>
                    <option value="50">50</option>
                    <option value="80">80</option>
                    <option value="100">100</option>
                  </select>
                </FormField>
                <FormField label="Amount" required>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Paid" required>
                    <input
                      type="number"
                      name="amount_paid"
                      value={form.amount_paid}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                  </FormField>
                  <FormField label="Remaining" required>
                    <input
                      type="number"
                      name="remaining_amount"
                      value={form.remaining_amount}
                      readOnly
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </FormField>
                </div>
                <FormField label="Deliverables">
                  <input
                    name="deliverables"
                    value={form.deliverables}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Delivery Date">
                  <input
                    type="date"
                    name="delivery_date"
                    value={form.delivery_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Order Status">
                  <select
                    name="order_status"
                    value={form.order_status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white"
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Notes">
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                      rows={3}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 transition-colors shadow-sm"
                onClick={saveOrder}
              >
                Save Order
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-500">
              !
            </div>
            <h3 className="mt-4 text-lg font-semibold text-charcoal-900">Delete this order?</h3>
            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone. {toDeleteOrder?.name && `Order: ${toDeleteOrder.name}`}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white" onClick={doDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Type Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-charcoal-900">Add New Type</h3>
            <p className="mt-1 text-xs text-slate-500">Enter a new photography type to add to the list.</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">Type Name</label>
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                placeholder="e.g. Birthday, Corporate"
                autoFocus
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setShowTypeModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
                onClick={addNewType}
              >
                Add Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-charcoal-900">Add New Service</h3>
            <p className="mt-1 text-xs text-slate-500">Enter a new service name to add to the checklist.</p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">Service Name</label>
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                placeholder="e.g. Drone, Live Streaming"
                autoFocus
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => setShowServiceModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
                onClick={addNewService}
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
      {/* View Order Modal */}
      {showView && viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-xl font-semibold text-charcoal-900">Order Details</h3>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
                onClick={() => setShowView(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              {/* Event Info */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Event Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs">Client Name</span>
                    <span className="font-medium text-slate-900">{viewOrder.name || viewOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Event Name</span>
                    <span className="font-medium text-slate-900">{viewOrder.event_name}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Date</span>
                    <span className="font-medium text-slate-900">
                      {viewOrder.event_date || viewOrder.date ? new Date(viewOrder.event_date || viewOrder.date).toLocaleDateString() : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Time</span>
                    <span className="font-medium text-slate-900">
                      {viewOrder.start_time || "--"} - {viewOrder.end_time || "--"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Location</span>
                    <span className="font-medium text-slate-900">{viewOrder.location || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Photography Type</span>
                    <span className="font-medium text-slate-900">{viewOrder.photography_type || viewOrder.photographyType || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Contact & Service */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Contact & Services</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs">WhatsApp</span>
                    <span className="font-medium text-slate-900">{viewOrder.whatsapp_no || viewOrder.customerPhone || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Email</span>
                    <span className="font-medium text-slate-900">{viewOrder.email || "-"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-slate-500 text-xs">Services Included</span>
                    <span className="font-medium text-slate-900">{viewOrder.service || (Array.isArray(viewOrder.services) ? viewOrder.services.join(", ") : "-")}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Album Pages</span>
                    <span className="font-medium text-slate-900">{viewOrder.album_pages || viewOrder.albumPages || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Deliverables</span>
                    <span className="font-medium text-slate-900">{viewOrder.deliverables || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Financials</h4>
                <div className="grid grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                  <div>
                    <span className="block text-slate-500 text-xs">Total Amount</span>
                    <span className="font-bold text-slate-900">₹{parseFloat(viewOrder.amount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Paid</span>
                    <span className="font-bold text-emerald-600">₹{(parseFloat(viewOrder.amount_paid) || parseFloat(viewOrder.paidAmount) || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-xs">Remaining</span>
                    <span className={`font-bold ${(parseFloat(viewOrder.amount || 0) - (parseFloat(viewOrder.amount_paid) || parseFloat(viewOrder.paidAmount) || 0)) > 0 ? "text-rose-600" : "text-slate-400"}`}>
                      ₹{(parseFloat(viewOrder.amount || 0) - (parseFloat(viewOrder.amount_paid) || parseFloat(viewOrder.paidAmount) || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {viewOrder.notes && (
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-md">{viewOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50">
              <button
                className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-white text-slate-700 transition-colors"
                onClick={() => downloadReceipt(viewOrder)}
              >
                <Download size={16} /> Download Receipt
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 transition-colors"
                onClick={() => openEdit(viewOrder)}
              >
                Edit Order
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
}

function FormField({ label, children, required }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}
