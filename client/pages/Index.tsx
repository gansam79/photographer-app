import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

const heroStats = [
  { label: "Shoots Delivered", value: 142, helper: "YTD across India" },
  { label: "Avg. Rating", value: "4.9★", helper: "Client feedback" },
  { label: "Delivery Speed", value: "7 days", helper: "Average turnarounds" },
];

const upcomingShoots = [
  { id: "1", event: "Rahul × Sneha Wedding", date: "12 Feb", city: "Pune", scope: "Cinematic + docu", status: "Crew locked" },
  { id: "2", event: "Aditi & Neel Engagement", date: "09 Mar", city: "Mumbai", scope: "Sunrise + beach", status: "Moodboard shared" },
  { id: "3", event: "Studio Samarth Lookbook", date: "30 Jan", city: "Mumbai", scope: "Commercial", status: "Lighting dry run" },
];

const financePulse = [
  { label: "Collected", value: "₹12.4L", detail: "82% of billed", accent: "from-emerald-100" },
  { label: "Outstanding", value: "₹2.1L", detail: "3 files overdue", accent: "from-rose-100" },
  { label: "Pipeline", value: "₹4.3L", detail: "In negotiations", accent: "from-amber-100" },
];

const actionQueue = [
  { id: "a1", title: "Share teaser with Ishaan", detail: "Pre-wed selects due tonight", due: "Today", type: "Deliverable" },
  { id: "a2", title: "Confirm crew for Kolhapur", detail: "Pack 2x FX3 + gimbal", due: "Tomorrow", type: "Logistics" },
  { id: "a3", title: "Follow up on invoice INV-24010", detail: "₹58K balance", due: "Monday", type: "Finance" },
];

export default function Index() {
  const [exampleFromServer, setExampleFromServer] = useState("");

  useEffect(() => {
    fetchDemo();
  }, []);

  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching hello:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal-900">
      <header className="relative overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 px-6 py-12 text-white shadow-xl sm:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Studio Command</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl font-semibold leading-tight">Lumina Collective Dashboard</h1>
              <p className="mt-4 text-sm text-white/80">
                Monitor bookings, finances, and production health for every wedding, editorial, and commercial brief.
                Syncs live with your Express backend & Mongo collections.
              </p>
              {exampleFromServer && (
                <p className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs text-white/80">
                  Live server ping: {exampleFromServer}
                </p>
              )}
            </div>
            <button className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-white/20">
              Compose New Quotation
            </button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map((item) => (
              <HeroStat key={item.label} {...item} />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-12">
        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Upcoming Shoots</h2>
                <p className="text-xs text-slate-500">Crew, logistics, and deliverable cues.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{upcomingShoots.length}</span>
            </div>
            <ul className="mt-6 space-y-4">
              {upcomingShoots.map((shoot) => (
                <li key={shoot.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{shoot.event}</p>
                      <p className="text-xs text-slate-500">{shoot.scope}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{shoot.date}</p>
                      <p>{shoot.city}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-emerald-600">{shoot.status}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            {financePulse.map((pulse) => (
              <FinanceCard key={pulse.label} {...pulse} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Action Queue</h2>
                <p className="text-xs text-slate-500">Auto-generated tasks from billing + production.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{actionQueue.length}</span>
            </div>
            <ul className="mt-6 space-y-4">
              {actionQueue.map((task) => (
                <li key={task.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 p-4">
                  <div>
                    <p className="text-sm font-semibold">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.detail}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-slate-600">{task.due}</p>
                    <p className="text-rose-500">{task.type}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Studio Signals</h2>
            <p className="text-xs text-slate-500">High-level cues across quoting, finance, and gallery handoffs.</p>
            <dl className="mt-6 space-y-4 text-sm text-slate-600">
              <SignalRow label="Quotations" value="12 active" helper="4 in negotiation" />
              <SignalRow label="Invoices" value="18 sent" helper="3 awaiting payout" />
              <SignalRow label="Gallery deliveries" value="5 live" helper="2 drafts in review" />
              <SignalRow label="Team" value="8 admins" helper="MFA enabled" />
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroStat({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 shadow-inner">
      <p className="text-xs uppercase tracking-[0.35em] text-white/70">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-white/60">{helper}</p>
    </div>
  );
}

function FinanceCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: string }) {
  return (
    <div className={`rounded-3xl border border-white/60 bg-gradient-to-br ${accent} to-white p-5 shadow-sm`}>
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function SignalRow({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div>
        <p className="font-semibold text-charcoal-900">{label}</p>
        <p className="text-xs text-slate-500">{helper}</p>
      </div>
      <p className="text-sm font-semibold text-charcoal-900">{value}</p>
    </div>
  );
}
