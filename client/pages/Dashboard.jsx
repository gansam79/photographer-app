import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  CreditCard,
  Users,
  TrendingUp,
  PlusCircle,
  Calendar,
  Camera,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
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
  const [upcomingShoots, setUpcomingShoots] = useState([]);
  const [pipelineStages, setPipelineStages] = useState([]);
  const [taskQueue, setTaskQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [quotationsRes, invoicesRes, clientsRes, ordersRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/invoices"),
        fetch("/api/clients"),
        fetch("/api/orders"),
      ]);

      const quotations = await quotationsRes.json();
      const invoices = await invoicesRes.json();
      const clients = await clientsRes.json();
      const orders = await ordersRes.json();

      // Calculate totals
      const totalBilled = invoices.reduce(
        (sum, inv) => sum + Number(inv.grandTotal ?? inv.total ?? 0),
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
        const amountPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const invoiceTotal = Number(invoice.grandTotal ?? invoice.total ?? 0);
        totalReceived += amountPaid;
        pendingPayments += Math.max(0, invoiceTotal - amountPaid);
      }

      setStats({
        totalBilled,
        totalReceived,
        pendingPayments,
        quotationsSent: quotations.length,
        totalClients: clients.length,
      });

      setRecentQuotations(quotations.slice(0, 4));
      setRecentInvoices(invoices.slice(0, 4));

      const totalQuotes = quotations.length || 1;
      const pipeline = [
        { key: "Draft", label: "Draft previews" },
        { key: "Sent", label: "Sent decks" },
        { key: "Negotiation", label: "Live negotiations" },
        { key: "Accepted", label: "Won gigs" },
      ].map((stage) => {
        const count = quotations.filter((q) => (q.status || "Draft") === stage.key).length;
        return {
          ...stage,
          count,
          percent: Math.round((count / totalQuotes) * 100),
        };
      });
      setPipelineStages(pipeline);

      const upcoming = Array.isArray(orders)
        ? orders
            .filter((order) => order.event_date)
            .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
            .slice(0, 4)
        : [];
      setUpcomingShoots(upcoming);

      const invoiceTasks = invoices
        .filter((inv) => (inv.status || "").toLowerCase() !== "paid")
        .map((inv) => {
          const total = Number(inv.grandTotal ?? inv.total ?? 0);
          const paid = Number(inv.amountPaid ?? inv.amount_paid ?? 0);
          const pending = Math.max(total - paid, 0);
          return {
            id: `inv-${inv._id}`,
            title: inv.clientName ? `Collect from ${inv.clientName}` : "Invoice collection",
            detail: `${formatCurrency(pending)} pending`,
            due: inv.dueDate || inv.event_date,
            type: "Billing",
          };
        });

      const quoteTasks = quotations
        .filter((quote) => (quote.status || "").toLowerCase() === "negotiation")
        .map((quote) => ({
          id: `quote-${quote._id}`,
          title: quote.clientName ? `Follow up ${quote.clientName}` : "Negotiation touchpoint",
          detail: quote.eventType || quote.event || "Event pending",
          due: quote.followUpDate || quote.follow_up || quote.updatedAt,
          type: "Pitch",
        }));

      const tasks = [...invoiceTasks, ...quoteTasks].slice(0, 5);
      setTaskQueue(tasks);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const utilization = useMemo(() => {
    const billed = stats.totalBilled || 0;
    const received = stats.totalReceived || 0;
    const pending = stats.pendingPayments || 0;
    const collectionRate = billed ? Math.round((received / billed) * 100) : 0;
    const outstandingRate = billed ? Math.round((pending / billed) * 100) : 0;
    const avgInvoice = stats.quotationsSent ? Math.round(billed / Math.max(stats.quotationsSent, 1)) : billed;
    return { collectionRate, outstandingRate, avgInvoice };
  }, [stats]);

  const quickActions = [
    {
      label: "New Quotation",
      description: "Spin up a styled offer deck",
      to: "/admin/quotations",
      icon: FileText,
    },
    {
      label: "Invoice Client",
      description: "Bill retainers or balance",
      to: "/admin/invoices",
      icon: CreditCard,
    },
    {
      label: "Book Crew",
      description: "Lock in shooters + gear",
      to: "/admin/orders",
      icon: Camera,
    },
    {
      label: "Block Calendar",
      description: "Reserve dates + venues",
      to: "/admin/orders",
      icon: Calendar,
    },
  ];

  const safeguardHighlights = [
    { title: "MFA enabled", detail: "13 of 15 admins", icon: ShieldCheck },
    { title: "Reminders", detail: "8 payouts this week", icon: CreditCard },
  ];

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Studio Pulse</p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-sm text-white/70">
              Bookings, billing, and client health indicators curated for your photography studio.
            </p>
          </div>
          <Link
            to="/admin/quotations"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow"
          >
            <PlusCircle className="h-4 w-4" />
            Compose Quotation
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <HeroMetric label="Collection rate" value={`${utilization.collectionRate}%`} trend="vs last month" positive />
          <HeroMetric label="Outstanding" value={`${utilization.outstandingRate}%`} trend="needs follow-up" />
          <HeroMetric label="Avg. invoice" value={formatCurrency(utilization.avgInvoice)} trend="per confirmed gig" positive />
        </div>
      </header>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Syncing your studio insights...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard icon={TrendingUp} label="Total billed" value={stats.totalBilled} />
            <KpiCard icon={CreditCard} label="Collected" value={stats.totalReceived} trend={utilization.collectionRate} />
            <KpiCard icon={FileText} label="Pending" value={stats.pendingPayments} negative trend={utilization.outstandingRate} />
            <KpiCard icon={Users} label="Active clients" value={stats.totalClients} raw />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-charcoal-900">Quick Actions</h2>
                  <p className="text-xs text-slate-500">Accelerate the next booking flow.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{quickActions.length}</span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <QuickActionCard key={action.label} {...action} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-charcoal-900">Safeguards</h2>
              <p className="text-xs text-slate-500">Keep payouts and galleries secure.</p>
              <div className="mt-4 space-y-3">
                {safeguardHighlights.map((item) => (
                  <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                    <item.icon className="h-10 w-10 rounded-xl bg-slate-50 p-2 text-charcoal-900" />
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <PipelinePanel stages={pipelineStages} />
            <UpcomingShootsPanel shoots={upcomingShoots} />
          </div>

          <TaskPanel tasks={taskQueue} />

          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-charcoal-900">Recent Invoices</h2>
                <Link to="/admin/invoices" className="text-xs font-semibold text-gold-600">
                  View all
                </Link>
              </div>
              {recentInvoices.length === 0 ? (
                <EmptyState message="No invoices yet. Bill your first client." />
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {recentInvoices.map((invoice) => (
                    <li key={invoice._id} className="py-3">
                      <div className="flex items-center justify-between text-sm text-charcoal-900">
                        <div>
                          <p className="font-semibold">{invoice.invoiceNumber || invoice.reference || invoice._id?.slice(-6) || "Invoice"}</p>
                          <p className="text-xs text-slate-500">{invoice.clientName || invoice.client?.name || "Client"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(invoice.grandTotal || invoice.total || 0)}</p>
                          <p className="text-xs text-slate-500">{invoice.status || "Draft"}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-charcoal-900">Recent Quotations</h2>
                <Link to="/admin/quotations" className="text-xs font-semibold text-gold-600">
                  View all
                </Link>
              </div>
              {recentQuotations.length === 0 ? (
                <EmptyState message="No quotes sent. Share a styled offer." />
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-charcoal-900">
                  {recentQuotations.map((quote) => (
                    <li key={quote._id} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{quote.quoteNumber || quote.reference || quote._id?.slice(-6) || "Quote"}</p>
                          <p className="text-xs text-slate-500">{quote.clientName || quote.client || "Client"}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{quote.status || "Draft"}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{quote.eventType || quote.event || "Event"}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function PipelinePanel({ stages = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-charcoal-900">Pipeline Health</h2>
          <p className="text-xs text-slate-500">Track quoting momentum at a glance.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          {stages.reduce((sum, stage) => sum + stage.count, 0)} files
        </span>
      </div>
      {stages.length === 0 ? (
        <EmptyState message="No quotes yet." />
      ) : (
        <div className="mt-4 space-y-4">
          {stages.map((stage) => (
            <StageMeter key={stage.key} stage={stage} />
          ))}
        </div>
      )}
    </div>
  );
}

function StageMeter({ stage }) {
  const colors = {
    Draft: "bg-slate-400",
    Sent: "bg-indigo-400",
    Negotiation: "bg-amber-500",
    Accepted: "bg-emerald-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-charcoal-900">
        <p className="font-semibold">{stage.label}</p>
        <span>{stage.count} • {stage.percent}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${colors[stage.key] || "bg-charcoal-900"}`} style={{ width: `${stage.percent}%` }} />
      </div>
    </div>
  );
}

function UpcomingShootsPanel({ shoots = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-charcoal-900">Upcoming Shoots</h2>
          <p className="text-xs text-slate-500">Crew + logistics checklist.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{shoots.length}</span>
      </div>
      {shoots.length === 0 ? (
        <EmptyState message="No shoots scheduled." />
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-charcoal-900">
          {shoots.map((shoot) => (
            <li key={shoot._id || shoot.id} className="rounded-xl border border-slate-100 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{shoot.event_name || shoot.event || "Shoot"}</p>
                  <p className="text-xs text-slate-500">{shoot.name || shoot.client || "Client"}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>{formatDateShort(shoot.event_date)}</p>
                  <p>{shoot.start_time || shoot.startTime || "--"}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{shoot.location || "TBD"}</span>
                <span className="inline-flex items-center gap-1"><Camera className="h-3.5 w-3.5" />{shoot.photography_type || shoot.service || "Package"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskPanel({ tasks = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-charcoal-900">Action Queue</h2>
          <p className="text-xs text-slate-500">Follow-ups auto generated from billing & pitches.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{tasks.length}</span>
      </div>
      {tasks.length === 0 ? (
        <EmptyState message="All tasks cleared. Enjoy the calm." />
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-charcoal-900">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-xs text-slate-500">{task.detail}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDateShort(task.due)}</p>
                <p className="inline-flex items-center gap-1 text-rose-500">
                  <AlertTriangle className="h-3.5 w-3.5" />{task.type}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, trend, negative, raw }) {
  const numeric = typeof value === "number" ? value : 0;
  const formatted = raw ? numeric.toLocaleString() : formatCurrency(numeric);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-charcoal-900">{formatted}</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-slate-50 text-charcoal-900 flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {typeof trend === "number" && (
        <p className={`mt-3 text-xs font-semibold ${negative ? "text-rose-500" : "text-emerald-600"}`}>
          {negative ? "▼" : "▲"} {trend}% vs last cycle
        </p>
      )}
    </div>
  );
}

function QuickActionCard({ label, description, to, icon: Icon }) {
  return (
    <Link to={to} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-gold-200">
      <Icon className="h-10 w-10 rounded-xl bg-slate-50 p-2 text-charcoal-900" />
      <div>
        <p className="font-semibold text-charcoal-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </Link>
  );
}

function HeroMetric({ label, value, trend, positive }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-white/60">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className={`text-xs ${positive ? "text-emerald-300" : "text-rose-200"}`}>{trend}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return <p className="py-6 text-center text-xs text-slate-500">{message}</p>;
}

function formatDateShort(dateStr) {
  if (!dateStr) return "--";
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "2-digit",
  }).format(new Date(dateStr));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
