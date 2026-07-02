import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../config/Api";
import { ShoppingBag, Clock, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";

const UserOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my-orders");
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "active") return o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled";
    if (activeTab === "completed") return o.orderStatus === "Delivered" || o.orderStatus === "Cancelled";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex justify-between items-center shadow-xs">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Order Archive
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">My Gourmet Orders</h1>
          <p className="text-sm text-text-secondary">Track live deliveries and view historical culinary invoices</p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-3 rounded-2xl bg-muted border border-border text-text-secondary hover:text-primary transition cursor-pointer"
        >
          <RefreshCw size={18} className={loading ? "animate-spin text-primary" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-border pb-3">
        {["all", "active", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${
              activeTab === tab
                ? "bg-primary text-white shadow-md"
                : "bg-surface border border-border text-text-secondary hover:border-primary/50"
            }`}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-surface rounded-3xl border border-border"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-surface p-12 rounded-3xl border border-border text-center space-y-3">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              🛍️
            </div>
            <h3 className="text-lg font-bold text-text-primary">No orders found in this tab</h3>
            <p className="text-xs text-text-muted">You haven't placed any orders matching this filter yet.</p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-primary-hover transition"
            >
              Explore Restaurants
            </Link>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord._id}
              className="bg-surface p-6 sm:p-8 rounded-3xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs hover:shadow-md transition"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-primary">#{ord.orderId || ord._id}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase">
                    {ord.orderStatus}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-text-primary truncate">
                  {ord.restaurantId?.name || "Partner Gourmet Kitchen"}
                </h3>

                <div className="flex items-center gap-4 text-xs font-semibold text-text-secondary">
                  <span>📅 {new Date(ord.createdAt).toLocaleDateString()}</span>
                  <span>📦 {ord.items?.length || 1} Dishes</span>
                  <span>💳 {ord.paymentMethod}</span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end justify-between gap-3 self-end sm:self-center w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                <span className="text-xl font-black text-text-primary">₹{ord.pricing?.totalAmount}</span>

                <Link
                  to={`/order-tracking/${ord._id}`}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-primary-hover transition flex items-center justify-center gap-1.5"
                >
                  Track Order <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
