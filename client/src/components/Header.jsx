import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useThemeStore from "../stores/useThemeStore";
import useCartStore from "../stores/useCartStore";
import {
  Sun,
  Moon,
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  MapPin,
  UtensilsCrossed,
  Bike,
  ShieldCheck,
} from "lucide-react";

const Header = () => {
  const { user, isLogin, logout } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const { getCartTotals } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const { totalItems } = getCartTotals();

  const getDashboardLink = () => {
    if (!user) return "/userDashboard";
    switch (user.role) {
      case "admin":
        return "/admin-dashboard";
      case "restaurant_owner":
        return "/owner-dashboard";
      case "delivery_partner":
        return "/partner-dashboard";
      default:
        return "/userDashboard";
    }
  };

  const getRoleBadge = () => {
    if (!user || user.role === "customer") return null;
    const badges = {
      admin: { label: "Admin Panel", icon: ShieldCheck, color: "bg-info/10 text-info border-info/20" },
      restaurant_owner: { label: "Restaurant Portal", icon: UtensilsCrossed, color: "bg-primary/10 text-primary border-primary/20" },
      delivery_partner: { label: "Delivery App", icon: Bike, color: "bg-success/10 text-success border-success/20" },
    };
    const b = badges[user.role];
    if (!b) return null;
    const Icon = b.icon;
    return (
      <Link
        to={getDashboardLink()}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${b.color} hover:scale-105 transition`}
      >
        <Icon size={14} />
        {b.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border transition-colors duration-300 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary/25 group-hover:scale-105 transition duration-300">
              C
            </div>
            <span className="text-2xl font-black tracking-tight text-text-primary group-hover:text-primary transition">
              Cravings
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-muted border border-border text-sm text-text-secondary">
            <MapPin size={16} className="text-primary shrink-0" />
            <span className="font-semibold truncate max-w-[180px]">Bandra West, Mumbai</span>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-text-secondary">
          <Link to="/" className="hover:text-primary transition">Explore</Link>
          <Link to="/menu" className="hover:text-primary transition">Cuisines</Link>
          <Link to="/about" className="hover:text-primary transition">Our Story</Link>
          <Link to="/contact" className="hover:text-primary transition">Support Desk</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {getRoleBadge()}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl bg-muted border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition cursor-pointer"
          >
            {theme === "dark" ? <Sun size={18} className="text-accent" /> : <Moon size={18} />}
          </button>

          {/* Cart Icon */}
          <Link
            to="/checkout"
            className="relative p-2.5 rounded-xl bg-muted border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[11px] font-black flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Section */}
          {isLogin && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-muted border border-border hover:border-primary/50 transition cursor-pointer"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={user?.fullName || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-primary"
                />
                <span className="hidden sm:inline text-xs font-bold text-text-primary max-w-[100px] truncate">
                  {user.fullName?.split(" ")[0] || "Profile"}
                </span>
              </button>

              {profileDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-surface rounded-2xl border border-border shadow-xl p-2 space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-bold text-text-primary truncate">{user.fullName}</p>
                    <p className="text-[11px] font-semibold text-text-muted capitalize">{user.role}</p>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:bg-muted hover:text-primary transition"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 transition cursor-pointer"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-muted border border-border text-xs font-bold text-text-primary hover:border-primary/50 hover:text-primary transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-primary text-white text-xs font-black shadow-md shadow-primary/25 hover:bg-primary-hover transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-muted text-text-secondary"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted border border-border text-xs text-text-secondary">
            <MapPin size={14} className="text-primary" /> Bandra West, Mumbai
          </div>

          <nav className="flex flex-col gap-3 text-sm font-bold text-text-primary">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Explore Cravings</Link>
            <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">All Cuisines</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Our Story</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Support Desk</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
