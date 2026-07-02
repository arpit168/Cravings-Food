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
  Bike,
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

  const handleToggleUserBlock = async (userId, currentBlocked) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`, { isBlocked: !currentBlocked });
      if (res.data && res.data.success) {
        toast.success(`User account ${!currentBlocked ? "blocked" : "unblocked"}`);
        fetchAdminData();
      }
    } catch (error) {
      toast.error("Error updating user status");
    }
  };

  const handleToggleRestaurantBlock = async (restId, currentBlocked) => {
    try {
      const res = await api.put(`/admin/restaurant/${restId}/status`, { isBlocked: !currentBlocked });
      if (res.data && res.data.success) {
        toast.success(`Restaurant ${!currentBlocked ? "suspended" : "activated"}`);
        fetchAdminData();
      }
    } catch (error) {
      toast.error("Error updating restaurant status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background transition-colors duration-300">
      {/* Header Banner */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <span className="px-3.5 py-1 rounded-full bg-info/10 text-info font-bold text-xs uppercase tracking-wider">
            Superuser Control Center
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">
            Platform Governance Console
          </h1>
          <p className="text-sm text-text-secondary">
            Global Admin <strong className="text-primary">{user?.fullName}</strong> • Full system oversight & compliance
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-text-primary hover:border-primary/50 transition cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-primary" : ""} /> Sync Database
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Customers</p>
          <p className="text-2xl font-black text-text-primary">{stats?.totalUsers || 0}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <UtensilsCrossed size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Restaurants</p>
          <p className="text-2xl font-black text-text-primary">{stats?.totalRestaurants || 0}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <Bike size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Delivery Partners</p>
          <p className="text-2xl font-black text-text-primary">{stats?.totalPartners || 0}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Platform Gross GMV</p>
          <p className="text-2xl font-black text-text-primary">₹{stats?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-border pb-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "overview"
              ? "bg-primary text-white shadow-md"
              : "bg-surface border border-border text-text-secondary hover:border-primary/50"
          }`}
        >
          Partner Kitchens ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "users"
              ? "bg-primary text-white shadow-md"
              : "bg-surface border border-border text-text-secondary hover:border-primary/50"
          }`}
        >
          Registered Accounts ({users.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" ? (
        <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-6 shadow-xs">
          <h2 className="text-lg font-black text-text-primary">Partner Kitchen Moderation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((r) => (
              <div key={r._id} className={`p-5 rounded-2xl bg-background border flex justify-between items-center gap-4 ${r.isBlocked ? "border-danger/50 opacity-75" : "border-border"}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={r.image} alt={r.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-text-primary truncate">{r.name}</h4>
                    <p className="text-xs text-text-secondary">{r.cuisines?.join(", ")}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-success/10 text-success inline-block">
                        {r.rating} ⭐ Verified
                      </span>
                      {r.isBlocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-danger/10 text-danger inline-block">
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleFeature(r._id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      r.isFeatured
                        ? "bg-primary text-white shadow-md"
                        : "bg-muted border border-border text-text-secondary hover:border-primary"
                    }`}
                  >
                    {r.isFeatured ? "★ Featured" : "Feature"}
                  </button>
                  <button
                    onClick={() => handleToggleRestaurantBlock(r._id, r.isBlocked)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      r.isBlocked
                        ? "bg-success text-white"
                        : "bg-danger/10 text-danger hover:bg-danger hover:text-white"
                    }`}
                  >
                    {r.isBlocked ? "Unblock" : "Suspend"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted border-b border-border text-text-primary uppercase font-bold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-secondary font-medium">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-muted/50 transition">
                  <td className="p-4 font-bold text-text-primary flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {u.fullName?.[0]}
                    </div>
                    {u.fullName}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-muted border border-border font-bold capitalize">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.mobileNumber || "N/A"}</td>
                  <td className="p-4">
                    {u.isBlocked ? (
                      <span className="text-danger font-bold flex items-center gap-1">🚫 Suspended</span>
                    ) : (
                      <span className="text-success font-bold flex items-center gap-1"><CheckCircle2 size={13} /> Active</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleToggleUserBlock(u._id, u.isBlocked)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                          u.isBlocked
                            ? "bg-success text-white hover:bg-success/90"
                            : "bg-danger/10 text-danger hover:bg-danger hover:text-white"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Suspend"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
