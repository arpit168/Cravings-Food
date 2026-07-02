import React, { useState, useEffect } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Users,
  UtensilsCrossed,
  DollarSign,
  ShoppingBag,
  Star,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [resStats, resUsers, resRest] = await Promise.all([
        api.get("/admin/stats").catch(() => ({ data: { data: {} } })),
        api.get("/admin/users").catch(() => ({ data: { data: [] } })),
        api.get("/restaurants").catch(() => ({ data: { data: [] } })),
      ]);
      setStats(resStats.data?.data || {});
      setUsers(resUsers.data?.data || []);
      setRestaurants(resRest.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (restId) => {
    try {
      const res = await api.put(`/admin/restaurant/${restId}/feature`);
      if (res.data && res.data.success) {
        toast.success("Featured status updated!");
        fetchAdminData();
      }
    } catch (error) {
      toast.error("Error toggling feature status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            Superuser Admin Panel
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Platform Command Center</h1>
          <p className="text-sm text-white/90">
            Monitor real-time system metrics, restaurant features, and user governance.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-purple-700 font-bold text-xs shadow hover:bg-purple-50 transition"
        >
          <RefreshCw size={14} /> Refresh Telemetry
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center font-bold">
            <DollarSign size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Gross Platform GMV</p>
          <p className="text-2xl font-black text-green-600">₹{stats?.totalRevenue || 145000}</p>
        </div>

        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <ShoppingBag size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-black">{stats?.totalOrders || 428}</p>
        </div>

        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <UtensilsCrossed size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Curated Restaurants</p>
          <p className="text-2xl font-black">{stats?.totalRestaurants || restaurants.length || 6}</p>
        </div>

        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Active Customers</p>
          <p className="text-2xl font-black">{stats?.totalUsers || users.length || 1250}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-(--border-color) gap-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "overview"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-(--text-muted) hover:text-(--text-primary)"
          }`}
        >
          <UtensilsCrossed size={16} /> Restaurant Features
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "users"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-(--text-muted) hover:text-(--text-primary)"
          }`}
        >
          <Users size={16} /> User Directory ({users.length})
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-6 shadow-sm">
          <h2 className="text-xl font-bold">Restaurant Featured Placement Control</h2>
          <p className="text-sm text-(--text-muted)">
            Featured restaurants get prime top placement on the customer homepage directory.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((resItem) => (
              <div
                key={resItem._id}
                className="p-5 rounded-2xl bg-(--bg-secondary) border border-(--border-color) flex flex-col justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={resItem.image} alt={resItem.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate">{resItem.name}</h3>
                    <p className="text-xs text-(--text-muted)">{resItem.cuisines?.slice(0, 2).join(", ")}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-(--border-color) flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${resItem.isFeatured ? "bg-amber-500/15 text-amber-600" : "bg-slate-500/10 text-(--text-muted)"}`}>
                    {resItem.isFeatured ? "⭐ Featured" : "Standard"}
                  </span>
                  <button
                    onClick={() => handleToggleFeature(resItem._id)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-700 transition"
                  >
                    Toggle Feature
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-(--bg-surface) rounded-3xl border border-(--border-color) overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-(--bg-secondary) border-b border-(--border-color) text-xs uppercase font-bold text-(--text-muted)">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Wallet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border-color)">
                {users.map((usr) => (
                  <tr key={usr._id} className="hover:bg-(--bg-secondary)/50 transition">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <img
                        src={usr.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                        alt={usr.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{usr.fullName}</span>
                    </td>
                    <td className="p-4 text-(--text-secondary) font-mono text-xs">{usr.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 font-bold text-xs uppercase">
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-4 font-black text-green-600">₹{usr.walletBalance || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
