import React, { useMemo, useState } from "react";
import { generateQuotationPDF } from "../utils/pdfGenerator";

const sampleQuotations = [
  {
    id: "QT-1058",
    quoteNo: "QT-1058",
    client: "Rahul & Sneha",
    event: "Wedding",
    location: "Pune",
    shootDate: "2026-02-12",
    createdAt: "2025-12-22",
    total: 135000,
    retainer: 50000,
    status: "Sent",
    stage: "Awaiting Approval",
    deliverables: ["2-day cinematic coverage", "Highlight film", "Signature album"],
    followUp: "2026-01-04",
    channel: "WhatsApp",
    moodboard: "https://mood.com/rahul-sneha",
    notes: "Need drone add-on confirmation.",
  },
  {
    id: "QT-1049",
    quoteNo: "QT-1049",
    client: "Ishaan Patil",
    event: "Pre-Wedding",
    location: "Mahabaleshwar",
    shootDate: "2026-01-18",
    createdAt: "2025-12-10",
    total: 62000,
    retainer: 20000,
    status: "Accepted",
    stage: "Contract Sent",
    deliverables: ["Full-day coverage", "8 looks moodboard", "Instagram teaser"],
    followUp: "2026-01-05",
    channel: "Email",
    moodboard: "https://mood.com/ishaan",
    notes: "Confirmed mountaintop shoot.",
  },
  {
    id: "QT-1035",
    quoteNo: "QT-1035",
    client: "Aditi & Neel",
    event: "Engagement",
    location: "Mumbai",
    shootDate: "2026-03-09",
    createdAt: "2025-11-02",
    total: 88000,
    retainer: 30000,
    status: "Negotiation",
    stage: "Budget Review",
    deliverables: ["City + beach coverage", "Story film", "Parent edit"],
    followUp: "2026-01-07",
    channel: "WhatsApp",
    moodboard: "https://mood.com/aditi-neel",
    notes: "Considering deluxe album upgrade.",
  },
  {
    id: "QT-1021",
    quoteNo: "QT-1021",
    client: "Studio Samarth",
    event: "Commercial",
    location: "Mumbai",
    shootDate: "2026-01-30",
    createdAt: "2025-10-15",
    total: 156000,
    retainer: 60000,
    status: "Expired",
    stage: "Archived",
    deliverables: ["Product catalogue", "Launch film", "BTS reel"],
    followUp: "2025-12-01",
    channel: "Email",
    moodboard: "",
    notes: "Budget shifted to Q3.",
  },
];

const quoteStatusStyles = {
  Draft: "bg-slate-100 text-slate-600",
  Sent: "bg-indigo-100 text-indigo-700",
  Negotiation: "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-600",
  Expired: "bg-slate-200 text-slate-600",
};

const statusFilters = ["all", "Draft", "Sent", "Negotiation", "Accepted", "Rejected", "Expired"];

const emptyQuote = {
  id: null,
  quoteNo: "",
  client: "",
  event: "Wedding",
  location: "",
  shootDate: "",
  total: "",
  retainer: "",
  status: "Draft",
  stage: "Concept",
  deliverables: "",
  followUp: "",
  channel: "Email",
  moodboard: "",
  notes: "",
};

export default function AdminQuotations() {
  const [quotes, setQuotes] = useState(sampleQuotations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyQuote);
  const [editingId, setEditingId] = useState(null);

  const stats = useMemo(() => {
    const sent = quotes.filter((q) => q.status !== "Draft").length;
    const accepted = quotes.filter((q) => q.status === "Accepted").length;
    const acceptanceRate = sent ? Math.round((accepted / sent) * 100) : 0;
    const pending = quotes.filter((q) => ["Sent", "Negotiation"].includes(q.status)).length;
    const avgDeal = quotes.length
      ? Math.round(quotes.reduce((sum, q) => sum + Number(q.total || 0), 0) / quotes.length)
      : 0;
    return { sent, acceptanceRate, pending, avgDeal };
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch = [quote.quoteNo, quote.client, quote.event, quote.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : quote.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [quotes, search, filter]);

  const followUpQueue = useMemo(() => {
    return [...quotes]
      .filter((q) => q.followUp && q.status !== "Accepted")
      .sort((a, b) => new Date(a.followUp) - new Date(b.followUp))
      .slice(0, 5);
  }, [quotes]);

  function handleGeneratePdf(quote) {
    const services = quote.deliverables.length
      ? quote.deliverables.map((item) => ({
          serviceName: item,
          quantity: 1,
          days: 1,
          ratePerDay: Math.round(Number(quote.total || 0) / Math.max(quote.deliverables.length, 1)),
          total: Math.round(Number(quote.total || 0) / Math.max(quote.deliverables.length, 1)),
        }))
      : [
          {
            serviceName: quote.event,
            quantity: 1,
            days: 1,
            ratePerDay: Number(quote.total || 0),
            total: Number(quote.total || 0),
          },
        ];

    const subtotal = Number(quote.total || 0);
    const taxPercentage = 18;
    const tax = Math.round((subtotal * taxPercentage) / 100);

    const quotationPayload = {
      quotationNumber: quote.quoteNo,
      quotationDate: quote.createdAt || new Date().toISOString(),
      eventDate: quote.shootDate || quote.createdAt,
      validityDate: quote.followUp || quote.shootDate || quote.createdAt,
      eventType: quote.event,
      services,
      subtotal,
      discount: 0,
      discountType: "fixed",
      taxPercentage,
      tax,
      grandTotal: subtotal + tax,
      paymentTerms: `₹${Number(quote.retainer || 0).toLocaleString()} retainer to block dates, rest before delivery`,
      notes: quote.notes,
      thankYouMessage: "Thank you for trusting Lumina Collective for your story.",
    };

    const clientProfile = {
      name: quote.client,
      email: `${quote.client?.toLowerCase().replace(/\s+/g, "") || "client"}@lumina.studio`,
      phone: "+91 90000 00000",
      address: quote.location,
    };

    generateQuotationPDF(quotationPayload, clientProfile);
  }

  function openModal(quote = null) {
    if (quote) {
      setForm({
        ...quote,
        deliverables: quote.deliverables?.join("\n") || "",
      });
      setEditingId(quote.id);
    } else {
      setForm({ ...emptyQuote });
      setEditingId(null);
    }
    setModalOpen(true);
  }

  function saveQuote() {
    if (!form.client.trim() || !form.quoteNo.trim()) return;
    const payload = {
      ...form,
      total: Number(form.total) || 0,
      retainer: Number(form.retainer) || 0,
      deliverables: form.deliverables
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };
    if (editingId) {
      setQuotes((prev) => prev.map((q) => (q.id === editingId ? { ...q, ...payload } : q)));
    } else {
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `QT-${Date.now()}`;
      setQuotes((prev) => [{ ...payload, id }, ...prev]);
    }
    setModalOpen(false);
  }

  function markAccepted(id) {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "Accepted", stage: "Booked" } : q)));
  }

  function duplicateQuote(quote) {
    const copy = {
      ...quote,
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `QT-${Date.now()}`,
      quoteNo: `${quote.quoteNo}-A`,
      status: "Draft",
      stage: "Concept",
    };
    setQuotes((prev) => [copy, ...prev]);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(value || 0)
    );
  }

  return (
    <section className="page-shell space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Pitching</p>
          <h1 className="text-3xl font-semibold text-charcoal-900 dark:text-white">Quotation Studio</h1>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-300">
            Shape bespoke photography offers, track approvals, and keep follow-ups on rhythm.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gold-600 sm:w-auto"
          onClick={() => openModal()}
        >
          <span className="text-lg">+</span>
          Compose Quote
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Sent this month" value={`${stats.sent}`} sub="Client decks" accent="from-amber-50" />
        <Metric label="Acceptance rate" value={`${stats.acceptanceRate}%`} sub="Win ratio" accent="from-emerald-50" />
        <Metric label="Pending approvals" value={`${stats.pending}`} sub="Need nudges" accent="from-rose-50" />
        <Metric label="Average deal" value={formatCurrency(stats.avgDeal)} sub="Per booking" accent="from-slate-100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2.1fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Quote Pipeline</h2>
              <p className="text-xs text-slate-500">{filteredQuotes.length} files • Sorted by shoot date</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client, city, quote #"
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">⌕</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 text-xs font-semibold">
            {statusFilters.map((value) => (
              <button
                key={value}
                className={`rounded-full border px-3 py-1 capitalize transition ${
                  filter === value ? "border-gold-500 bg-gold-50 text-gold-600" : "border-transparent bg-slate-100 text-slate-600"
                }`}
                onClick={() => setFilter(value)}
              >
                {value === "all" ? "All" : value}
              </button>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Quote</th>
                  <th className="px-4 py-3 text-left font-semibold">Client & Event</th>
                  <th className="px-4 py-3 text-left font-semibold">Shoot Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Deliverables</th>
                  <th className="px-4 py-3 text-left font-semibold">Value</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      No quotations match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal-900">{quote.quoteNo}</p>
                        <p className="text-xs text-slate-500">{quote.stage}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal-900">{quote.client}</p>
                        <p className="text-xs text-slate-500">{quote.event} • {quote.location}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="text-xs">{formatDate(quote.shootDate)}</div>
                        <div className="text-xs text-slate-400">Issued {formatDate(quote.createdAt)}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <ul className="space-y-1">
                          {quote.deliverables.slice(0, 3).map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal-900">{formatCurrency(quote.total)}</p>
                        <p className="text-xs text-slate-500">Retainer {formatCurrency(quote.retainer)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${quoteStatusStyles[quote.status] || "bg-slate-100 text-slate-600"}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            onClick={() => openModal(quote)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            onClick={() => duplicateQuote(quote)}
                          >
                            Duplicate
                          </button>
                          <button
                            className="rounded-md border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                            onClick={() => markAccepted(quote.id)}
                            disabled={quote.status === "Accepted"}
                          >
                            Mark Won
                          </button>
                          <button
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            onClick={() => handleGeneratePdf(quote)}
                          >
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 px-4 py-5 md:hidden">
            {filteredQuotes.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No quotations match your filters.</p>
            ) : (
              filteredQuotes.map((quote) => (
                <div key={quote.id} className="space-y-3 rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-charcoal-900">{quote.quoteNo}</p>
                      <p className="text-xs text-slate-500">{quote.stage}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        quoteStatusStyles[quote.status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                  <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{quote.client}</p>
                      <p>
                        {quote.event} • {quote.location}
                      </p>
                    </div>
                    <div>
                      <p>Shoot — {formatDate(quote.shootDate)}</p>
                      <p>Issued — {formatDate(quote.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-charcoal-900">{formatCurrency(quote.total)}</div>
                  <ul className="text-xs text-slate-600">
                    {quote.deliverables.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>Follow-up {formatDate(quote.followUp)}</span>
                    <div className="flex gap-2 text-xs">
                      <button
                        className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-700"
                        onClick={() => openModal(quote)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-blue-100 px-3 py-1 font-semibold text-blue-600"
                        onClick={() => duplicateQuote(quote)}
                      >
                        Copy
                      </button>
                      <button
                        className="rounded-md border border-emerald-100 px-3 py-1 font-semibold text-emerald-600"
                        onClick={() => markAccepted(quote.id)}
                        disabled={quote.status === "Accepted"}
                      >
                        Won
                      </button>
                        <button
                          className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-700"
                          onClick={() => handleGeneratePdf(quote)}
                        >
                          PDF
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-charcoal-900">Follow-up Radar</h3>
                <p className="text-xs text-slate-500">Auto-prioritized by due date</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{followUpQueue.length}</span>
            </div>
            <ul className="mt-4 space-y-3">
              {followUpQueue.map((quote) => (
                <li key={quote.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{quote.client}</p>
                      <p className="text-xs text-slate-500">{quote.event}</p>
                    </div>
                    <span className="text-xs font-semibold text-rose-500">{formatDate(quote.followUp)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">via {quote.channel}</p>
                  <p className="mt-2 text-xs text-charcoal-900">{quote.notes}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Package Blueprint</h3>
            <p className="text-xs text-slate-500">Most requested deliverables</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <Blueprint title="Signature Wedding" items={["2 lead photographers", "Cinematic + candid team", "Album + parent books"]} />
              <Blueprint title="Intimate Elopement" items={["Solo storyteller", "Half-day coverage", "Story film teaser"]} />
              <Blueprint title="Commercial Lookbook" items={["Light crew", "14 looks", "BTS reel for social"]} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Shot Planning Notes</h3>
            <ul className="mt-3 space-y-3 text-xs text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Bundle hotel stay</p>
                <p>Add on-site stay to premium tiers for stress-free logistics.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Preview within 72h</p>
                <p>Fast teaser delivery increases conversion by 28%.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Offer moodboard swap</p>
                <p>Share 3 visual directions to encourage upsells.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Quotation</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">{editingId ? "Edit Quote" : "Compose Quote"}</h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Quote No." required>
                <input
                  value={form.quoteNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, quoteNo: e.target.value }))}
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
              <Field label="Event Type">
                <select
                  value={form.event}
                  onChange={(e) => setForm((prev) => ({ ...prev, event: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Wedding</option>
                  <option>Pre-Wedding</option>
                  <option>Engagement</option>
                  <option>Commercial</option>
                  <option>Baby Shower</option>
                </select>
              </Field>
              <Field label="Shoot Date">
                <input
                  type="date"
                  value={form.shootDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, shootDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Value" required>
                <input
                  type="number"
                  value={form.total}
                  onChange={(e) => setForm((prev) => ({ ...prev, total: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Retainer">
                <input
                  type="number"
                  value={form.retainer}
                  onChange={(e) => setForm((prev) => ({ ...prev, retainer: e.target.value }))}
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
                  <option>Negotiation</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                  <option>Expired</option>
                </select>
              </Field>
              <Field label="Workflow Stage">
                <select
                  value={form.stage}
                  onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Concept</option>
                  <option>Styled Deck</option>
                  <option>Budget Review</option>
                  <option>Contract Sent</option>
                  <option>Booked</option>
                </select>
              </Field>
              <Field label="Follow-up Date">
                <input
                  type="date"
                  value={form.followUp}
                  onChange={(e) => setForm((prev) => ({ ...prev, followUp: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Channel">
                <select
                  value={form.channel}
                  onChange={(e) => setForm((prev) => ({ ...prev, channel: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Email</option>
                  <option>WhatsApp</option>
                  <option>Call</option>
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Deliverables (one per line)">
                  <textarea
                    rows={3}
                    value={form.deliverables}
                    onChange={(e) => setForm((prev) => ({ ...prev, deliverables: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Moodboard URL">
                  <input
                    value={form.moodboard}
                    onChange={(e) => setForm((prev) => ({ ...prev, moodboard: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </Field>
              </div>
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
              <button className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white" onClick={saveQuote}>
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} to-white p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function Blueprint({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <p className="text-sm font-semibold text-charcoal-900">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
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

function formatDate(dateStr) {
  if (!dateStr) return "--";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(dateStr));
}
