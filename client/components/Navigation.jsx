import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quotations", path: "/quotations" },
    { label: "Invoices", path: "/invoices" },
    { label: "Clients", path: "/clients" },
  ];

  return (
    <nav className="bg-white dark:bg-charcoal-900 border-b border-gold-200 dark:border-charcoal-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-playfair font-bold text-lg">
                P
              </span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-playfair text-charcoal-900 dark:text-white font-bold text-sm">
                The Patil Photography
              </h1>
              <p className="font-montserrat text-gold-600 text-xs">& Film's</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-montserrat font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-gold-600 border-b-2 border-gold-600 pb-1"
                    : "text-charcoal-700 dark:text-charcoal-200 hover:text-gold-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gold-50 dark:hover:bg-charcoal-800 rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-charcoal-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-charcoal-900 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded font-montserrat font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-gold-100 text-gold-700 dark:bg-charcoal-800 dark:text-gold-400"
                    : "text-charcoal-700 dark:text-charcoal-200 hover:bg-gold-50 dark:hover:bg-charcoal-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
