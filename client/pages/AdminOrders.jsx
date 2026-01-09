import React, { useEffect, useMemo, useState } from "react";

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
    // normalize dates
    setForm({ ...order, event_date: order.event_date ? order.event_date.split("T")[0] : "" });
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save order");
      await fetchOrders();
      setShowForm(false);
      setEditingOrder(null);
    } catch (err) {
      console.error(err);
      alert("Could not save order");
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

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
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
                <th className="px-4 py-3 text-left font-semibold">WhatsApp</th>
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Location</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Paid</th>
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
                orders.map((order) => (
                  <tr key={order._id} className="odd:bg-white even:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-charcoal-900">{order.name}</td>
                    <td className="px-4 py-3 text-slate-600">{order.whatsapp_no}</td>
                    <td className="px-4 py-3">{order.event_name}</td>
                    <td className="px-4 py-3">{order.photography_type || order.service}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {order.event_date ? new Date(order.event_date).toLocaleDateString() : "--"}
                    </td>
                    <td className="px-4 py-3">{order.location}</td>
                    <td className="px-4 py-3 font-medium text-charcoal-900">
                      {order.amount?.toLocaleString ? `₹${order.amount.toLocaleString()}` : order.amount}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.amount_paid?.toLocaleString ? `₹${order.amount_paid.toLocaleString()}` : order.amount_paid}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.order_status)}`}>
                        {order.order_status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          onClick={() => openEdit(order)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-md border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          onClick={() => confirmDelete(order)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Order</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">
                  {editingOrder ? "Edit Order" : "Add New Order"}
                </h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <FormField label="Name" required>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="WhatsApp No." required>
                <input
                  name="whatsapp_no"
                  value={form.whatsapp_no}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Email">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Event Name">
                <input
                  name="event_name"
                  value={form.event_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Photography Type" required>
                <select
                  name="photography_type"
                  value={form.photography_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option value="">Choose type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Pre-Wedding">Pre-Wedding</option>
                  <option value="Baby Shower">Baby Shower</option>
                </select>
              </FormField>
              <FormField label="Location" required>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Date" required>
                <input
                  type="date"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Start Time">
                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="End Time">
                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Service" required>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option value="">Choose Service</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Candid">Candid</option>
                  <option value="Traditional">Traditional</option>
                </select>
              </FormField>
              <FormField label="Album Pages" required>
                <select
                  name="album_pages"
                  value={form.album_pages}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
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
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Paid" required>
                <input
                  type="number"
                  name="amount_paid"
                  value={form.amount_paid}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Remaining" required>
                <input
                  type="number"
                  name="remaining_amount"
                  value={form.remaining_amount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Deliverables">
                <input
                  name="deliverables"
                  value={form.deliverables}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Delivery Date">
                <input
                  type="date"
                  name="delivery_date"
                  value={form.delivery_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </FormField>
              <FormField label="Order Status">
                <select
                  name="order_status"
                  value={form.order_status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    rows={3}
                  />
                </FormField>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white" onClick={saveOrder}>
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
