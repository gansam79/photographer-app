import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function QuotationForm({ quotation, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    clientId: "",
    eventType: "Wedding",
    eventDate: "",
    validityDate: "",
    services: [],
    discount: 0,
    discountType: "fixed",
    taxPercentage: 18,
    paymentTerms: "50% advance, 50% on event date",
    notes: "",
    thankYouMessage:
      "Thank you for choosing The Patil Photography & Film's. We look forward to capturing your special moments!",
  });

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    fetchClients();
    fetchServices();
  }, []);

  useEffect(() => {
    if (quotation) {
      setFormData({
        ...quotation,
        clientId: quotation.clientId._id,
      });
    }
  }, [quotation]);

  useEffect(() => {
    calculateTotals();
  }, [
    formData.services,
    formData.discount,
    formData.discountType,
    formData.taxPercentage,
  ]);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    formData.services.forEach((item) => {
      subtotal += item.total || 0;
    });

    let discountAmount = 0;
    if (formData.discountType === "percentage") {
      discountAmount = (subtotal * formData.discount) / 100;
    } else {
      discountAmount = formData.discount;
    }

    const taxableAmount = subtotal - discountAmount;
    const tax = (taxableAmount * formData.taxPercentage) / 100;
    const grandTotal = taxableAmount + tax;

    setTotals({
      subtotal,
      tax: Math.round(tax),
      grandTotal: Math.round(grandTotal),
    });

    setFormData((prev) => ({
      ...prev,
      subtotal,
      tax: Math.round(tax),
      grandTotal: Math.round(grandTotal),
    }));
  };

  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          serviceId: "",
          serviceName: "",
          quantity: 1,
          days: 1,
          ratePerDay: 0,
          total: 0,
        },
      ],
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;

    if (field === "serviceId") {
      const selectedService = services.find((s) => s._id === value);
      if (selectedService) {
        updatedServices[index].serviceName = selectedService.name;
        updatedServices[index].ratePerDay = selectedService.ratePerDay || 0;
      }
    }

    if (["quantity", "days", "ratePerDay"].includes(field)) {
      const qty = parseInt(updatedServices[index].quantity) || 1;
      const days = parseInt(updatedServices[index].days) || 1;
      const rate = parseFloat(updatedServices[index].ratePerDay) || 0;
      updatedServices[index].total = qty * days * rate;
    }

    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
    }));
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId || formData.services.length === 0) {
      alert("Please select a client and add at least one service");
      return;
    }

    try {
      const method = quotation ? "PUT" : "POST";
      const url = quotation
        ? `/api/quotations/${quotation._id}`
        : "/api/quotations";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save quotation");
      const savedQuotation = await response.json();
      onSave(savedQuotation);
    } catch (error) {
      console.error("Error saving quotation:", error);
      alert("Error saving quotation");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gold-200 dark:border-charcoal-700 sticky top-0 bg-white dark:bg-charcoal-800">
          <h2 className="font-playfair text-2xl font-bold text-charcoal-900 dark:text-white">
            {quotation ? "Edit Quotation" : "Create New Quotation"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gold-50 dark:hover:bg-charcoal-700 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client & Event Info */}
          <div>
            <h3 className="font-montserrat font-semibold text-charcoal-900 dark:text-white mb-3">
              Client & Event Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
              >
                <option value="">Select Client *</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
              >
                <option value="Wedding">Wedding</option>
                <option value="Pre-wedding">Pre-wedding</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
              />
              <input
                type="date"
                name="validityDate"
                value={formData.validityDate}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-montserrat font-semibold text-charcoal-900 dark:text-white">
                Services
              </h3>
              <button
                type="button"
                onClick={handleAddService}
                className="flex items-center gap-1 px-3 py-1 bg-gold-500 hover:bg-gold-600 text-white text-sm rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            <div className="space-y-3">
              {formData.services.map((service, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <select
                    value={service.serviceId}
                    onChange={(e) =>
                      handleServiceChange(index, "serviceId", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white text-sm"
                  >
                    <option value="">Select Service</option>
                    {services.map((svc) => (
                      <option key={svc._id} value={svc._id}>
                        {svc.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={service.quantity}
                    onChange={(e) =>
                      handleServiceChange(index, "quantity", e.target.value)
                    }
                    placeholder="Qty"
                    className="w-16 px-2 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    min="1"
                    value={service.days}
                    onChange={(e) =>
                      handleServiceChange(index, "days", e.target.value)
                    }
                    placeholder="Days"
                    className="w-16 px-2 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    value={service.ratePerDay}
                    onChange={(e) =>
                      handleServiceChange(index, "ratePerDay", e.target.value)
                    }
                    placeholder="Rate"
                    className="w-24 px-2 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white text-sm"
                  />
                  <div className="w-24 px-2 py-2 bg-gold-50 dark:bg-charcoal-700 rounded font-montserrat font-semibold text-charcoal-900 dark:text-white text-right text-sm">
                    ₹{service.total.toLocaleString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Discount & Tax */}
          <div>
            <h3 className="font-montserrat font-semibold text-charcoal-900 dark:text-white mb-3">
              Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-montserrat text-sm text-charcoal-600 dark:text-charcoal-300 mb-1">
                  Discount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discount: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="flex-1 px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
                  />
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountType: e.target.value,
                      }))
                    }
                    className="w-24 px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-montserrat text-sm text-charcoal-600 dark:text-charcoal-300 mb-1">
                  Tax (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.taxPercentage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      taxPercentage: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm text-charcoal-600 dark:text-charcoal-300 mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentTerms: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-montserrat font-semibold text-charcoal-900 dark:text-white mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
            />
          </div>

          {/* Totals */}
          <div className="bg-gold-50 dark:bg-charcoal-700 p-4 rounded space-y-2">
            <div className="flex justify-between font-montserrat">
              <span className="text-charcoal-700 dark:text-charcoal-300">
                Subtotal:
              </span>
              <span className="font-semibold text-charcoal-900 dark:text-white">
                ₹{totals.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between font-montserrat">
              <span className="text-charcoal-700 dark:text-charcoal-300">
                Tax ({formData.taxPercentage}%):
              </span>
              <span className="font-semibold text-charcoal-900 dark:text-white">
                ₹{totals.tax.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gold-200 dark:border-charcoal-600 pt-2 flex justify-between font-montserrat font-bold text-lg">
              <span className="text-charcoal-900 dark:text-white">
                Grand Total:
              </span>
              <span className="text-gold-600">
                ₹{totals.grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-semibold rounded transition-colors"
            >
              {quotation ? "Update Quotation" : "Create Quotation"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gold-500 text-gold-600 hover:bg-gold-50 dark:hover:bg-charcoal-700 font-montserrat font-semibold rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
