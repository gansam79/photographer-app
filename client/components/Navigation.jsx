import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Dashboard" },
  { to: "/quotations", label: "Quotations" },
  { to: "/invoices", label: "Invoices" },
  { to: "/clients", label: "Clients" },
  { to: "/orders", label: "Orders" },
  { to: "/gallery", label: "Gallery" },
  { to: "/users", label: "Users" },
  { to: "/slider", label: "Slider" },
  { to: "/clients", label: "Admin Clients" },
  { to: "/invoices", label: "Admin Invoices" },
  { to: "/quotations", label: "Admin Quotations" },
  { to: "/accessories", label: "Accessories" },
  { to: "/register", label: "Admin Register" },
  { to: "/profile", label: "Profile" },
];

export default function Navigation() {
  return (
    <aside
      aria-label="Main navigation"
      className="bg-white dark:bg-charcoal-900 border-r border-gold-200 dark:border-charcoal-800 min-h-screen p-4 flex-shrink-0"
      style={{ width: 220, minWidth: 220, zIndex: 20 }}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-playfair font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-playfair text-charcoal-900 dark:text-white font-bold text-sm">The Patil Photography</h1>
            <p className="font-montserrat text-gold-600 text-xs">& Film's</p>
          </div>
        </div>
      </div>

      <nav>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.to}>
              <NavLink
                to={it.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm font-medium ${isActive ? "bg-gold-500 text-white" : "text-charcoal-700 dark:text-charcoal-200 hover:bg-gold-50"}`
                }
              >
                {it.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
