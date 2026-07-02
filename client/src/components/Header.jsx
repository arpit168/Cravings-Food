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
      admin: { label: "Admin Panel", icon: ShieldCheck, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
      restaurant_owner: { label: "Restaurant Portal", icon: UtensilsCrossed, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
      delivery_partner: { label: "Delivery App", icon: Bike, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
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
    <header className="sticky top-0 z-50 bg-(--bg-surface)/90 backdrop-blur-md border-b border-(--border-color) transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition duration-300">
              C
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Cravings
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-(--bg-secondary) border border-(--border-color) text-sm text-(--text-secondary)">
            <MapPin size={16} className="text-orange-500 shrink-0" />
            <span className="font-medium truncate max-w-[180px]">Linking Road, Bandra West</span>
          </div>
        </div>

        {/* Center: Quick Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-(--text-secondary)">
          <Link to="/" className="hover:text-orange-500 transition">
            Home
          </Link>
          <Link to="/menu" className="hover:text-orange-500 transition">
            Explore Menu
          </Link>
          <Link to="/about" className="hover:text-orange-500 transition">
            Our Story
          </Link>
          <Link to="/contact" className="hover:text-orange-500 transition">
            Support
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {getRoleBadge()}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-(--bg-secondary) text-(--text-secondary) hover:text-orange-500 transition border border-(--border-color)"
            title="Toggle Light/Dark Theme"
          >
            {theme === "dark" ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} />}
          </button>

          {/* Cart Badge */}
          <Link
            to="/checkout"
            className="relative p-2.5 rounded-xl bg-(--bg-secondary) text-(--text-secondary) hover:text-orange-500 transition border border-(--border-color) flex items-center gap-2 font-semibold"
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-orange-600/30 animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth Button or User Menu */}
          {isLogin && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-(--bg-secondary) border border-(--border-color) hover:border-orange-500/50 transition"
              >
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-sm font-semibold truncate max-w-[100px]">{user.fullName.split(" ")[0]}</span>
              </button>

              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-(--bg-card) border border-(--border-color) shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-(--border-color) mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">{user.role.replace("_", " ")}</p>
                    <p className="text-sm font-bold truncate">{user.fullName}</p>
                    <p className="text-xs text-(--text-muted) truncate">{user.email}</p>
                  </div>

                  <Link
                    to={getDashboardLink()}
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-(--bg-hover) transition"
                  >
                    <LayoutDashboard size={16} className="text-orange-500" />
                    Dashboard
                  </Link>

                  <Link
                    to="/userDashboard"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-(--bg-hover) transition"
                  >
                    <User size={16} className="text-blue-500" />
                    Profile & Orders
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition mt-1"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-(--text-primary) hover:bg-(--bg-hover) transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-95 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-(--bg-secondary) text-(--text-secondary)"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-(--bg-card) border-b border-(--border-color) p-6 space-y-4 animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium hover:text-orange-500"
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium hover:text-orange-500"
          >
            Explore Menu
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium hover:text-orange-500"
          >
            Our Story
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-lg font-medium hover:text-orange-500"
          >
            Support
          </Link>
          {isLogin && (
            <Link
              to={getDashboardLink()}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-bold text-orange-500 pt-2 border-t border-(--border-color)"
            >
              My Dashboard ({user?.role?.replace("_", " ")})
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
