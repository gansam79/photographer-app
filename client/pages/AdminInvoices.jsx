import React, { useMemo, useState } from "react";

const seedInvoices = [
  {
    id: "INV-24021",
    invoiceNo: "INV-24021",
    client: "Rahul & Sneha",
    event: "Wedding",
    issueDate: "2025-10-02",
    dueDate: "2025-10-12",
    amount: 145000,
    paid: 95000,
    status: "Partial",
    stage: "Editing",
    paymentMethod: "Bank Transfer",
    notes: "Awaiting highlight film approval.",
  },
  {
    id: "INV-24018",
    invoiceNo: "INV-24018",
    client: "Ishaan Patil",
    event: "Pre-Wedding",
    issueDate: "2025-09-15",
    dueDate: "2025-10-05",
    amount: 62000,
    paid: 62000,
    status: "Paid",
    stage: "Delivered",
    paymentMethod: "UPI",
    notes: "Paid in full before outdoor shoot.",
  },
  {
    id: "INV-24010",
    invoiceNo: "INV-24010",
    client: "Aditi & Neel",
    event: "Engagement",
    issueDate: "2025-08-22",
    dueDate: "2025-09-01",
    amount: 88000,
    paid: 30000,
    status: "Overdue",
    stage: "Album Design",
    paymentMethod: "Cash",
    notes: "Follow-up scheduled for Monday.",
  },
  {
    id: "INV-24005",
    invoiceNo: "INV-24005",
    client: "Studio Samarth",
    event: "Commercial",
    issueDate: "2025-07-02",
    dueDate: "2025-07-20",
    amount: 156000,
    paid: 156000,
    status: "Paid",
    stage: "Archived",
    paymentMethod: "NEFT",
    notes: "Annual retainer settled.",
  },
];

const emptyInvoice = {
  id: null,
  invoiceNo: "",
  client: "",
  event: "Wedding",
  issueDate: "",
  dueDate: "",
  amount: "",
  paid: "0",
  status: "Draft",
  stage: "Planning",
  paymentMethod: "UPI",
  notes: "",
};

const statusStyles = {
  Draft: "bg-slate-100 text-slate-600",
  Sent: "bg-indigo-100 text-indigo-700",
  Partial: "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Overdue: "bg-rose-100 text-rose-600",
};

const filterOptions = ["all", "Draft", "Sent", "Partial", "Paid", "Overdue"];

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState(seedInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyInvoice);
  const [editingId, setEditingId] = useState(null);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const collected = invoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0);
    const outstanding = invoices.reduce(
      (sum, inv) => sum + Math.max(Number(inv.amount || 0) - Number(inv.paid || 0), 0),
      0
    );
    const overdue = invoices.filter((inv) => isOverdue(inv)).length;
    return {
      total,
      collected,
      outstanding,
      overdue,
    };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = [inv.invoiceNo, inv.client, inv.event]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        statusFilter === "all" ? true : inv.status === statusFilter || (statusFilter === "Overdue" && isOverdue(inv));
      return matchesSearch && matchesFilter;
    });
  }, [invoices, search, statusFilter]);

  const upcomingDue = useMemo(() => {
    return [...invoices]
      .filter((inv) => inv.status !== "Paid")
      .sort((a, b) => new Date(a.dueDate || Date.now()) - new Date(b.dueDate || Date.now()))
      .slice(0, 4);
  }, [invoices]);

  const paymentMix = useMemo(() => {
    const totals = invoices.reduce((acc, inv) => {
      const method = inv.paymentMethod || "Other";
      acc[method] = (acc[method] || 0) + Number(inv.paid || 0);
      return acc;
    }, {});
    const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(totals).map(([method, value]) => ({
      method,
      value,
      percent: Math.round((value / sum) * 100),
    }));
  }, [invoices]);

  function openModal(invoice = null) {
    if (invoice) {
      setForm({ ...invoice });
      setEditingId(invoice.id);
    } else {
      setForm({ ...emptyInvoice });
      setEditingId(null);
    }
    setModalOpen(true);
  }

  function saveInvoice() {
    if (!form.client.trim() || !form.invoiceNo.trim() || !form.amount) return;
    const payload = {
      ...form,
      amount: Number(form.amount),
      paid: Number(form.paid),
    };
    if (editingId) {
      setInvoices((prev) => prev.map((inv) => (inv.id === editingId ? { ...inv, ...payload } : inv)));
    } else {
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `INV-${Date.now()}`;
      setInvoices((prev) => [{ ...payload, id }, ...prev]);
    }
    setModalOpen(false);
  }

  function markAsPaid(id) {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid", paid: Number(inv.amount) } : inv))
    );
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(value || 0)
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Finance</p>
          <h1 className="text-3xl font-semibold text-charcoal-900 dark:text-white">Invoice Command Center</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-300">
            Track photography retainers, production balances, and delivery-linked payouts in one dashboard.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gold-600"
          onClick={() => openModal()}
        >
          <span className="text-lg">+</span>
          Create Invoice
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <OverviewCard label="Billed this season" value={formatCurrency(stats.total)} subLabel="Gross" accent="from-amber-50" />
        <OverviewCard label="Collected" value={formatCurrency(stats.collected)} subLabel="Deposited" accent="from-emerald-50" />
        <OverviewCard label="Outstanding" value={formatCurrency(stats.outstanding)} subLabel="Yet to collect" accent="from-rose-50" />
        <OverviewCard label="Overdue" value={`${stats.overdue} files`} subLabel="Need follow-up" accent="from-slate-100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2.1fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Invoice Ledger</h2>
              <p className="text-xs text-slate-500">Sorted by due date • {filteredInvoices.length} active</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client, event, invoice #"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">⌕</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 text-xs font-semibold">
            {filterOptions.map((option) => (
              <button
                key={option}
                className={`rounded-full border px-3 py-1 capitalize transition ${
                  statusFilter === option ? "border-gold-500 bg-gold-50 text-gold-600" : "border-transparent bg-slate-100 text-slate-600"
                }`}
                onClick={() => setStatusFilter(option)}
              >
                {option === "all" ? "All" : option}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                  <th className="px-4 py-3 text-left font-semibold">Client & Event</th>
                  <th className="px-4 py-3 text-left font-semibold">Issue / Due</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Progress</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      No invoices match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const balance = Math.max(Number(invoice.amount) - Number(invoice.paid), 0);
                    const progress = Math.min(100, Math.round((Number(invoice.paid || 0) / Number(invoice.amount || 1)) * 100));
                    return (
                      <tr key={invoice.id} className="odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal-900">{invoice.invoiceNo}</p>
                          <p className="text-xs text-slate-500">{invoice.stage}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal-900">{invoice.client}</p>
                          <p className="text-xs text-slate-500">{invoice.event}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="text-xs">{formatDate(invoice.issueDate)} • Issue</div>
                          <div className="text-xs text-rose-500">{formatDate(invoice.dueDate)} • Due</div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal-900">{formatCurrency(invoice.amount)}</p>
                          <p className="text-xs text-slate-500">Bal {formatCurrency(balance)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-semibold text-slate-600">{progress}%</div>
                          <div className="mt-1 h-2 rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-gold-500" style={{ width: `${progress}%` }} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[invoice.status] || "bg-slate-100 text-slate-600"}`}>
                            {isOverdue(invoice) ? "Overdue" : invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                              onClick={() => openModal(invoice)}
                            >
                              Edit
                            </button>
                            <button
                              className="rounded-md border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                              onClick={() => markAsPaid(invoice.id)}
                              disabled={invoice.status === "Paid"}
                            >
                              Mark Paid
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

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-charcoal-900">Upcoming Due Dates</h3>
                <p className="text-xs text-slate-500">Auto-sort by urgency</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {upcomingDue.length}
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {upcomingDue.map((invoice) => (
                <li key={invoice.id} className="flex items-start justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">{invoice.client}</p>
                    <p className="text-xs text-slate-500">{invoice.event}</p>
                    <p className="mt-1 text-xs text-rose-500">Due {formatDate(invoice.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-charcoal-900">{formatCurrency(invoice.amount - invoice.paid)}</p>
                    <p className="text-xs text-slate-400">Remaining</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Payment Mix</h3>
            <p className="text-xs text-slate-500">Where the money landed</p>
            <div className="mt-4 space-y-3">
              {paymentMix.map((entry) => (
                <div key={entry.method}>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{entry.method}</span>
                    <span>{entry.percent}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-charcoal-900" style={{ width: `${entry.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Workflow Notes</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Send teaser-linked invoices</p>
                <p className="text-xs text-slate-500">Attach preview gallery for faster approvals.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Automate WhatsApp nudges</p>
                <p className="text-xs text-slate-500">Schedule reminders 48h before due date.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Reward early settlements</p>
                <p className="text-xs text-slate-500">Offer 5% off on advance payments.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Invoice</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">{editingId ? "Edit Invoice" : "New Invoice"}</h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Invoice No." required>
                <input
                  value={form.invoiceNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, invoiceNo: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Client" required>
                <input
                  value={form.client}
                  onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Event">
                <select
                  value={form.event}
                  onChange={(e) => setForm((prev) => ({ ...prev, event: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Wedding</option>
                  <option>Pre-Wedding</option>
                  <option>Engagement</option>
                  <option>Commercial</option>
                </select>
              </Field>
              <Field label="Issue Date">
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Due Date">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Amount" required>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Paid">
                <input
                  type="number"
                  value={form.paid}
                  onChange={(e) => setForm((prev) => ({ ...prev, paid: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Draft</option>
                  <option>Sent</option>
                  <option>Partial</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </Field>
              <Field label="Workflow Stage">
                <select
                  value={form.stage}
                  onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Planning</option>
                  <option>Shoot</option>
                  <option>Editing</option>
                  <option>Album Design</option>
                  <option>Delivered</option>
                </select>
              </Field>
              <Field label="Payment Method">
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>NEFT</option>
                  <option>Cash</option>
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </Field>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white" onClick={saveInvoice}>
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function OverviewCard({ label, value, subLabel, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} to-white p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{formatSubLabel(subLabel)}</p>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function isOverdue(invoice) {
  if (invoice.status === "Paid") return false;
  if (!invoice.dueDate) return false;
  const due = new Date(invoice.dueDate);
  const now = new Date();
  return due < now;
}

function formatDate(dateStr) {
  if (!dateStr) return "--";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(dateStr));
}

function formatSubLabel(text) {
  return text || "";
}
