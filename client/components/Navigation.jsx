import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard" },
  // { to: "/quotations", label: "Quotations" },
  { to: "/orders", label: "Orders" },
  { to: "/gallery", label: "Gallery" },
  { to: "/users", label: "Users" },
  { to: "/slider", label: "Slider" },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/invoices", label: "Invoices" },
  { to: "/admin/quotations", label: "Quotations" },
  { to: "/accessories", label: "Accessories" },
  { to: "/admin/register", label: "Admin Register" },
  { to: "/profile", label: "Profile" },
];

export default function Navigation({ isMobileOpen = false, onClose = () => {} }) {
  return (
    <>
      <aside aria-label="Main navigation" className="hidden flex-shrink-0 lg:flex" style={{ width: 240 }}>
        <div className="flex min-h-screen w-60 flex-col border-r border-gold-200 bg-white p-4 dark:border-charcoal-800 dark:bg-charcoal-900">
          <BrandHeader />
          <NavList />
        </div>
      </aside>

      {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 dark:bg-charcoal-900 lg:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col border-r border-gold-200 dark:border-charcoal-800">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-charcoal-800">
            <BrandHeader compact />
            <button
              type="button"
              aria-label="Close navigation"
              className="rounded-md border border-slate-200 px-3 py-1 text-sm font-semibold text-charcoal-700 hover:bg-slate-100 dark:border-charcoal-700 dark:text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <NavList onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}

function BrandHeader({ compact = false }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "mb-4"}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600">
        <span className="font-playfair text-lg font-bold text-white">P</span>
      </div>
      <div>
        <h1 className="font-playfair text-sm font-bold text-charcoal-900 dark:text-white">The Patil Photography</h1>
        <p className="font-montserrat text-xs text-gold-600">& Film's</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }) {
  const handleClick = onNavigate ? () => onNavigate() : undefined;
  return (
    <nav className="mt-4 flex-1 overflow-y-auto">
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              onClick={handleClick}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm font-medium transition ${isActive ? "bg-gold-500 text-white" : "text-charcoal-700 hover:bg-gold-50 dark:text-charcoal-200"}`
              }
            >
              {it.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
