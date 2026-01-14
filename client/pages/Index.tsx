import { DemoResponse } from "@shared/api";
import { useEffect, useState } from "react";

const heroStats = [
  { label: "Total", value: 142, helper: "Couples tracked", accent: "from-[#fff5dc]" },
  { label: "Active", value: 32, helper: "Shoots on floor", accent: "from-[#e9f9f0]" },
  { label: "Leads", value: 18, helper: "Warm inquiries", accent: "from-[#e8f0ff]" },
  { label: "Pipeline", value: "₹4.3L", helper: "Quoted value", accent: "from-[#ffedf0]" },
];

const upcomingShoots = [
  { id: "1", event: "Rahul × Sneha Wedding", date: "12 Feb", city: "Pune", scope: "Cinematic + docu", status: "Crew locked" },
  { id: "2", event: "Aditi & Neel Engagement", date: "09 Mar", city: "Mumbai", scope: "Sunrise + beach", status: "Moodboard shared" },
  { id: "3", event: "Studio Samarth Lookbook", date: "30 Jan", city: "Mumbai", scope: "Commercial", status: "Lighting dry run" },
];

const financePulse = [
  { label: "Collected", value: "₹12.4L", detail: "82% of billed", accent: "from-emerald-50" },
  { label: "Outstanding", value: "₹2.1L", detail: "3 files overdue", accent: "from-rose-50" },
  { label: "Pipeline", value: "₹4.3L", detail: "In negotiations", accent: "from-amber-50" },
];

const actionQueue = [
  { id: "a1", title: "Share teaser with Ishaan", detail: "Pre-wed selects due tonight", due: "Today", type: "Deliverable" },
  { id: "a2", title: "Confirm crew for Kolhapur", detail: "Pack 2× FX3 + gimbal", due: "Tomorrow", type: "Logistics" },
  { id: "a3", title: "Follow up invoice INV-24010", detail: "₹58K balance", due: "Monday", type: "Finance" },
];

const signalTiles = [
  { label: "Quotations", value: "12 active", helper: "4 in negotiation" },
  { label: "Invoices", value: "18 sent", helper: "3 awaiting payout" },
  { label: "Gallery", value: "5 live", helper: "2 drafts in QC" },
  { label: "Team", value: "8 admins", helper: "MFA enforced" },
];

const quickSlices = [
  { label: "All Workflows", count: 28 },
  { label: "Weddings", count: 12 },
  { label: "Commercial", count: 8 },
  { label: "Editorial", count: 4 },
];

const dayTimeline = [
  { time: "08:30", title: "Crew standup", detail: "Lighting matrix review", state: "live" },
  { time: "10:15", title: "Client handoff", detail: "Aditi & Neel selects", state: "due" },
  { time: "14:00", title: "Finance sync", detail: "Invoice batching", state: "next" },
  { time: "18:30", title: "Gallery export", detail: "Studio Samarth", state: "queued" },
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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-charcoal-900">
      <div className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-[420px] w-[720px] rounded-full bg-gradient-to-r from-rose-200/30 via-amber-100/20 to-emerald-200/30 blur-3xl" />
      <section className="page-shell relative z-10 space-y-6">
        <header className="rounded-4xl border border-[#e6eaf2] bg-gradient-to-br from-white via-[#fdfefe] to-[#f5f7fb] p-6 text-charcoal-900 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap gap-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Studio Command</p>
              <h1 className="text-4xl font-semibold leading-tight text-charcoal-900">Lumina Collective Ops Center</h1>
              <p className="text-sm text-slate-600">
                Orchestrate shoots, finance, and post workflows from a single cockpit. Mirrors the tonal system from profile & admin onboarding screens for a unified feel.
              </p>
              {exampleFromServer && (
                <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-600">
                  Live server ping: {exampleFromServer}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {quickSlices.map((slice) => (
                  <QuickFilter key={slice.label} {...slice} />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-[260px] space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Next Milestone</p>
                <p className="mt-2 text-xl font-semibold text-charcoal-900">Rahul × Sneha pheras</p>
                <p className="text-sm text-slate-600">Crew call 05:00 IST • Pune</p>
                <button className="mt-4 w-full rounded-xl bg-[#d39a6f] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#c7885b]">
                  Compose New Quotation
                </button>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-semibold text-charcoal-900">Health Snapshot</p>
                <p>82% invoices cleared • 4 briefs awaiting rates • 2 galleries exporting</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((item) => (
              <HeroStat key={item.label} {...item} />
            ))}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-charcoal-900">Upcoming Shoots</h2>
                <p className="text-xs text-slate-500">Logistics, scope, and readiness trackers.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{upcomingShoots.length} scheduled</span>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingShoots.map((shoot) => (
                <UpcomingCard key={shoot.id} {...shoot} />
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            {financePulse.map((pulse) => (
              <FinanceCard key={pulse.label} {...pulse} />
            ))}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-lg shadow-slate-200/60">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Ops note</p>
              <p className="mt-2 text-charcoal-900">Kolhapur crew ETA confirmed • Swap gimbal battery packs.</p>
            </div>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-charcoal-900">Action Queue</h2>
                <p className="text-xs text-slate-500">Generated from finance + production signals.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{actionQueue.length} tasks</span>
            </div>
            <div className="mt-6 space-y-4">
              {actionQueue.map((task) => (
                <ActionCard key={task.id} {...task} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-charcoal-900">Studio Signals</h2>
                <p className="text-xs text-slate-500">Mirrors the admin/profile tonal palette.</p>
              </div>
              <button className="text-xs font-semibold text-gold-600">Share pulse</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {signalTiles.map((tile) => (
                <SignalCard key={tile.label} {...tile} />
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-charcoal-900">Crew Capacity</h2>
            <p className="text-xs text-slate-500">Match admin register vibes with soft badges.</p>
            <div className="mt-5 grid gap-3 text-sm text-charcoal-900">
              <CapacityBadge label="Lead shooters" value="4 / 5" helper="One slot open" />
              <CapacityBadge label="Editors" value="6 / 6" helper="All assigned" />
              <CapacityBadge label="Drone pilots" value="2 / 3" helper="Need backup" />
            </div>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-charcoal-900">Finance Snapshot</h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <SignalRow label="Payables" value="₹1.4L" helper="Due this week" />
              <SignalRow label="Receivables" value="₹2.1L" helper="3 files follow-up" />
              <SignalRow label="Avg collection" value="5.2 days" helper="Down 1.3 days WoW" />
            </dl>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-charcoal-900">Integrations</h2>
            <p className="text-xs text-slate-500">Keeps parity with profile cards.</p>
            <ul className="mt-5 space-y-3 text-sm text-charcoal-900">
              <li className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <span>Google Drive ingest</span>
                <span className="text-xs text-emerald-600">Synced 2 hrs ago</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <span>Slack alerts</span>
                <span className="text-xs text-amber-600">Muted till 9am</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <span>Notion shotlists</span>
                <span className="text-xs text-slate-500">Manual refresh</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-charcoal-900">Today Timeline</h2>
                <p className="text-xs text-slate-500">In sync with profile’s activity language.</p>
              </div>
              <button className="text-xs font-semibold text-slate-600">Export agenda</button>
            </div>
            <div className="mt-6 space-y-4">
              {dayTimeline.map((entry) => (
                <TimelineItem key={entry.time} {...entry} />
              ))}
            </div>
          </section>
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-lg font-semibold text-charcoal-900">Spotlight Stories</h2>
            <p className="text-xs text-slate-500">Keeps hero energy flowing into gallery teasers.</p>
            <div className="mt-5 grid gap-4">
              <SpotlightCard title="Aditi × Neel" detail="Sunrise engagement | Mumbai" status="Gallery drafting" />
              <SpotlightCard title="Studio Samarth" detail="Lookbook | Commercial" status="In color grade" />
              <SpotlightCard title="Kavya × Ohm" detail="Reception | Goa" status="Awaiting approvals" />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ label, value, helper, accent = "from-slate-50" }: { label: string; value: string | number; helper: string; accent?: string }) {
  return (
    <div className={`rounded-3xl border border-slate-100 bg-gradient-to-br ${accent} to-white p-4 shadow-[0_15px_40px_rgba(15,23,42,0.06)]`}>
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function UpcomingCard({ event, scope, date, city, status }: { event: string; scope: string; date: string; city: string; status: string }) {
  return (
    <article className="rounded-2xl border border-slate-100 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-charcoal-900">{event}</p>
          <p className="text-xs text-slate-500">{scope}</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{date}</p>
          <p>{city}</p>
        </div>
      </div>
      <p className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">{status}</p>
    </article>
  );
}

function FinanceCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: string }) {
  return (
    <div className={`rounded-3xl border border-slate-100 bg-gradient-to-br ${accent} to-white p-5 shadow-sm`}>
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function ActionCard({ title, detail, due, type }: { title: string; detail: string; due: string; type: string }) {
  return (
    <article className="flex items-start justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-charcoal-900">{title}</p>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
      <div className="text-right text-xs">
        <p className="font-semibold text-slate-600">{due}</p>
        <p className="text-rose-500">{type}</p>
      </div>
    </article>
  );
}

function SignalCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{helper}</p>
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

function CapacityBadge({ label, value, helper }: { label: string; value: string; helper: string }) {
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

function QuickFilter({ label, count }: { label: string; count: number }) {
  return (
    <button className="rounded-full border border-slate-200 bg-white/90 px-4 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-amber-200 hover:text-amber-600">
      {label}
      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-600">{count}</span>
    </button>
  );
}

function TimelineItem({ time, title, detail, state }: { time: string; title: string; detail: string; state: string }) {
  const badgeMap: Record<string, string> = {
    live: "bg-emerald-50 text-emerald-600",
    due: "bg-amber-50 text-amber-600",
    next: "bg-slate-100 text-slate-600",
    queued: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="flex items-start gap-4">
      <div className="text-xs font-semibold text-slate-500">{time}</div>
      <div className="flex-1 rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-charcoal-900">{title}</p>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${badgeMap[state] || "bg-slate-100 text-slate-600"}`}>
            {state}
          </span>
        </div>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function SpotlightCard({ title, detail, status }: { title: string; detail: string; status: string }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-sm font-semibold text-charcoal-900">{title}</p>
      <p className="text-xs text-slate-500">{detail}</p>
      <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-gold-600">{status}</p>
    </article>
  );
}
