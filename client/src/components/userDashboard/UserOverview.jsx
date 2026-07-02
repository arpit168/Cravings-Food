import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/Api";
import { ShoppingBag, CreditCard, LifeBuoy, ArrowRight, Star } from "lucide-react";

const UserOverview = ({ setActive }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my-orders");
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((acc, curr) => acc + (curr.pricing?.totalAmount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            User Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">
            Welcome, {user?.fullName || "Gourmet Member"}!
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your food orders, saved addresses, and wallet rewards all in one place.
          </p>
        </div>

        <button
          onClick={() => setActive && setActive("orders")}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:bg-primary-hover transition cursor-pointer"
        >
          Order History <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Total Food Orders</p>
          <p className="text-2xl font-black text-text-primary">{orders.length} Orders</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <CreditCard size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Total Amount Spent</p>
          <p className="text-2xl font-black text-text-primary">₹{totalSpent}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <LifeBuoy size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Membership Tier</p>
          <p className="text-2xl font-black text-text-primary flex items-center gap-1.5">
            Gold VIP <Star size={18} className="text-primary fill-primary" />
          </p>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-6 shadow-xs">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <h2 className="text-lg font-black text-text-primary">Recent Orders Summary</h2>
          <button
            onClick={() => setActive && setActive("orders")}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            View All Orders →
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-2xl"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="font-bold text-text-primary">No food orders placed yet</p>
            <p className="text-xs text-text-muted">Explore Cravings kitchens to order your first gourmet meal.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.slice(0, 3).map((ord) => (
              <div key={ord._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="font-black text-xs text-primary">#{ord.orderId || ord._id}</span>
                  <h4 className="font-bold text-sm text-text-primary mt-1">{ord.restaurantId?.name || "Gourmet Kitchen"}</h4>
                  <p className="text-xs text-text-muted">Placed on {new Date(ord.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="font-black text-sm text-text-primary">₹{ord.pricing?.totalAmount}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px] uppercase">
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;
