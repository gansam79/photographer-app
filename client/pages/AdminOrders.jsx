import React, { useEffect, useState } from "react";

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
    <div>
      <div className="pagetitle mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <section className="Odrer-sec">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="order-main d-flex justify-content-between items-center mb-4">
                    <h5 className="card-title">Manage Order</h5>
                    <button type="button" className="btn btn-primary btn-sm" onClick={openAdd}>
                      <i className="bi bi-plus-circle me-1" /> Add New Order
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered mt-3">
                      <thead className="table-dark">
                        <tr>
                          <th>Name</th>
                          <th>WhatsApp</th>
                          <th>Event</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Location</th>
                          <th>Amount</th>
                          <th>Paid</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={10} className="text-center py-8">
                              Loading orders...
                            </td>
                          </tr>
                        ) : orders.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="text-center py-8">
                              No orders found
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order._id}>
                              <td>{order.name}</td>
                              <td>{order.whatsapp_no}</td>
                              <td>{order.event_name}</td>
                              <td>{order.photography_type || order.service}</td>
                              <td>{order.event_date ? new Date(order.event_date).toLocaleDateString() : ""}</td>
                              <td>{order.location}</td>
                              <td>{order.amount?.toLocaleString ? `₹${order.amount.toLocaleString()}` : order.amount}</td>
                              <td>{order.amount_paid?.toLocaleString ? `₹${order.amount_paid.toLocaleString()}` : order.amount_paid}</td>
                              <td>
                                <span className={`badge ${order.order_status === "Pending" ? "bg-warning" : order.order_status === "In Progress" ? "bg-primary" : order.order_status === "Delivered" ? "bg-success" : "bg-danger"}`}>
                                  {order.order_status}
                                </span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-primary me-1" onClick={() => openEdit(order)}>
                                  <i className="bi bi-pencil-square" />
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => confirmDelete(order)}>
                                  <i className="bi bi-trash" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add / Edit Modal (simple) */}
                  {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-xl max-w-4xl w-full mx-4">
                        <div className="p-4 border-b">
                          <h3 className="font-semibold">{editingOrder ? "Edit Order" : "Add New Order"}</h3>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="form-label">Name*</label>
                              <input name="name" value={form.name} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">WhatsApp No.*</label>
                              <input name="whatsapp_no" value={form.whatsapp_no} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">Email</label>
                              <input name="email" value={form.email} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">Event Name</label>
                              <input name="event_name" value={form.event_name} onChange={handleChange} className="form-control" />
                            </div>

                            <div>
                              <label className="form-label">Photography Type*</label>
                              <select name="photography_type" value={form.photography_type} onChange={handleChange} className="form-select">
                                <option value="">Choose type</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Pre-Wedding">Pre-Wedding</option>
                                <option value="Baby Shower">Baby Shower</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">Location*</label>
                              <input name="location" value={form.location} onChange={handleChange} className="form-control" />
                            </div>

                            <div>
                              <label className="form-label">Date*</label>
                              <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">Start Time</label>
                              <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="form-control" />
                            </div>

                            <div>
                              <label className="form-label">End Time</label>
                              <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">Service*</label>
                              <select name="service" value={form.service} onChange={handleChange} className="form-select">
                                <option value="">Choose Service</option>
                                <option value="Cinematic">Cinematic</option>
                                <option value="Candid">Candid</option>
                                <option value="Traditional">Traditional</option>
                              </select>
                            </div>

                            <div>
                              <label className="form-label">Album Pages*</label>
                              <select name="album_pages" value={form.album_pages} onChange={handleChange} className="form-select">
                                <option value="">Choose pages</option>
                                <option value="50">50</option>
                                <option value="80">80</option>
                                <option value="100">100</option>
                              </select>
                            </div>

                            <div>
                              <label className="form-label">Amount*</label>
                              <input type="number" name="amount" value={form.amount} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">Paid*</label>
                              <input type="number" name="amount_paid" value={form.amount_paid} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">Remaining*</label>
                              <input type="number" name="remaining_amount" value={form.remaining_amount} onChange={handleChange} className="form-control" />
                            </div>

                            <div>
                              <label className="form-label">Deliverables</label>
                              <input name="deliverables" value={form.deliverables} onChange={handleChange} className="form-control" />
                            </div>
                            <div>
                              <label className="form-label">Delivery Date</label>
                              <input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange} className="form-control" />
                            </div>

                            <div>
                              <label className="form-label">Order Status</label>
                              <select name="order_status" value={form.order_status} onChange={handleChange} className="form-select">
                                <option value="">Select status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label className="form-label">Notes</label>
                              <textarea name="notes" value={form.notes} onChange={handleChange} className="form-control" rows={2} />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                            Close
                          </button>
                          <button className="btn btn-primary" onClick={saveOrder}>
                            Save Order
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete modal */}
                  {showDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="p-4 border-b">
                          <h3 className="font-semibold">Confirm Delete</h3>
                        </div>
                        <div className="p-4">
                          <p>Are you sure you want to delete the order for <strong>{toDeleteOrder?.name}</strong>?</p>
                          <p className="text-danger mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                          <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
                          <button className="btn btn-danger" onClick={doDelete}>Delete</button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
