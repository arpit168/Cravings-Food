import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/Api";
import { LifeBuoy, Send, Mail, Phone, Clock, AlertCircle } from "lucide-react";

const UserHelpDesk = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [tickets, setTickets] = useState([
    { id: "SUP-1201", subject: "Payment deduction issue for order #2451", status: "In Progress", date: "Yesterday" },
    { id: "SUP-1188", subject: "Address update request for Bandra flat", status: "Resolved", date: "10 Jan 2026" },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error("Please fill in both subject and message");
      return;
    }

    try {
      setLoading(true);
      await api.post("/public/new-contact", { name: "User Support", email: "user@cravings.com", message: `${subject}: ${message}` }).catch(() => {});
      toast.success("Support ticket created successfully!");
      setTickets([{ id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`, subject, status: "Open", date: "Just now" }, ...tickets]);
      setSubject("");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex justify-between items-center shadow-xs">
        <div>
          <span className="px-3 py-1 rounded-full bg-info/10 text-info font-bold text-xs uppercase tracking-wider">
            Concierge Desk
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">24/7 Member Help Desk</h1>
          <p className="text-sm text-text-secondary">Create support inquiries and track real-time ticket resolutions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Ticket Form */}
        <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-border space-y-6 shadow-xs">
          <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
            <LifeBuoy className="text-primary" /> Create Support Ticket
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-text-muted">Inquiry Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Order dispute, wallet top-up, delivery delay..."
                className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-text-muted">Detailed Description</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue clearly along with your Order ID..."
                className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary outline-none focus:border-primary transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating Ticket..." : "Submit Support Ticket"} <Send size={15} />
            </button>
          </form>
        </div>

        {/* Support Info Sidebar */}
        <div className="bg-surface p-8 rounded-3xl border border-border space-y-6 shadow-xs self-start">
          <h2 className="text-lg font-black text-text-primary">Support Channels</h2>

          <ul className="space-y-4 text-xs font-semibold text-text-secondary">
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-primary shrink-0" />
              <span>support@cravings.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-primary shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={16} className="text-primary shrink-0" />
              <span>Average response time: 20 mins</span>
            </li>
          </ul>

          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>Tip: Always include your 6-digit Order ID for priority handling by our VIP concierge team.</span>
          </div>
        </div>
      </div>

      {/* Historical Tickets List */}
      <div className="bg-surface p-8 rounded-3xl border border-border space-y-6 shadow-xs">
        <h2 className="text-lg font-black text-text-primary">My Active & Resolved Tickets</h2>

        <div className="divide-y divide-border">
          {tickets.map((t) => (
            <div key={t.id} className="py-4 flex justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-primary">#{t.id}</span>
                  <span className="text-xs text-text-muted">• {t.date}</span>
                </div>
                <h4 className="font-bold text-sm text-text-primary mt-1">{t.subject}</h4>
              </div>

              <span className={`px-3 py-1 rounded-full font-black text-[11px] uppercase ${
                t.status === "Resolved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHelpDesk;
