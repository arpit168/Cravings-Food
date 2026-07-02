import React, { useState } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/public/new-contact", formData);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Thank you! Our support team will reach out within 2 hours.");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      toast.error("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 bg-background transition-colors duration-300">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-text-primary">24/7 Priority Support</h1>
        <p className="text-text-muted text-sm sm:text-base">
          Have a question about your order, partner onboarding, or billing? Our dedicated concierge team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-3xl border border-border flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-text-muted">Instant Hotline</p>
              <p className="font-bold text-lg text-text-primary">+91 98765 43210</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-border flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-info/10 text-info flex items-center justify-center shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-text-muted">Email Desk</p>
              <p className="font-bold text-lg text-text-primary">support@cravings.com</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-border flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-text-muted">Headquarters</p>
              <p className="font-bold text-sm text-text-primary">Sunshine Towers, Linking Road, Bandra West, Mumbai 400050</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface p-8 rounded-3xl border border-border space-y-4 shadow-xl"
        >
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <MessageSquare className="text-primary" /> Send us a message
          </h2>

          <div>
            <label className="text-xs font-bold uppercase text-text-muted">Your Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Rohan Sharma"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-text-primary text-sm outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-text-muted">Your Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rohan@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-text-primary text-sm outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-text-muted">Message</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you today?"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-text-primary text-sm outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/30 hover:bg-primary-hover transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Sending..." : "Submit Inquiry"} <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
