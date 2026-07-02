import React from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, ShieldCheck, Heart, Share2, Globe, MessageCircle, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-(--bg-card) border-t border-(--border-color) pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30">
              C
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Cravings
            </span>
          </Link>
          <p className="text-sm text-(--text-muted) max-w-sm leading-relaxed">
            Experience world-class culinary masterpieces delivered straight to your doorstep with real-time tracking, zero temperature loss, and unmatched care.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="w-9 h-9 rounded-xl bg-(--bg-secondary) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:text-orange-500 hover:border-orange-500/50 transition" title="Global Community">
              <Globe size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-(--bg-secondary) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:text-orange-500 hover:border-orange-500/50 transition" title="Share Cravings">
              <Share2 size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-(--bg-secondary) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:text-orange-500 hover:border-orange-500/50 transition" title="Customer Chat">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-(--text-primary)">Explore</h4>
          <ul className="space-y-2.5 text-sm font-medium text-(--text-secondary)">
            <li><Link to="/" className="hover:text-orange-500 transition">Restaurants Near Me</Link></li>
            <li><Link to="/menu" className="hover:text-orange-500 transition">Bestseller Dishes</Link></li>
            <li><Link to="/about" className="hover:text-orange-500 transition">Our Philosophy</Link></li>
            <li><Link to="/contact" className="hover:text-orange-500 transition">24/7 Help Center</Link></li>
          </ul>
        </div>

        {/* Multi-Role Portals */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-(--text-primary)">Partner Portals</h4>
          <ul className="space-y-2.5 text-sm font-medium text-(--text-secondary)">
            <li><Link to="/register" className="hover:text-orange-500 transition flex items-center gap-1.5"><UtensilsCrossed size={14} className="text-orange-500"/> Register Restaurant</Link></li>
            <li><Link to="/register" className="hover:text-blue-500 transition flex items-center gap-1.5"><ShieldCheck size={14} className="text-blue-500"/> Become Delivery Driver</Link></li>
            <li><Link to="/login" className="hover:text-purple-500 transition">Admin Login</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-wider text-(--text-primary)">Contact Us</h4>
          <ul className="space-y-3 text-sm text-(--text-secondary)">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
              <span>Linking Road, Bandra West, Mumbai 400050</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-orange-500 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-orange-500 shrink-0" />
              <span>support@cravings.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-(--border-color) flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-(--text-muted)">
        <p>© {new Date().getFullYear()} Cravings Inc. Built with passion for food lovers.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by Arpit Gupta
        </p>
      </div>
    </footer>
  );
};

export default Footer;
