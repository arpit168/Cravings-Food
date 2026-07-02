import React, { useState, useEffect } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Bike,
  Navigation,
  CheckCircle2,
  DollarSign,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      setLoading(true);
      const [resAvail, resMy] = await Promise.all([
        api.get("/partner/available").catch(() => ({ data: { data: [] } })),
        api.get("/partner/my-deliveries").catch(() => ({ data: { data: [] } })),
      ]);
      setAvailableOrders(resAvail.data?.data || []);
      setMyDeliveries(resMy.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await api.put(`/partner/${orderId}/accept`);
      if (res.data && res.data.success) {
        toast.success("Delivery order accepted! Head to the restaurant.");
        fetchPartnerData();
      }
    } catch (error) {
      toast.error("Error accepting order");
    }
  };

  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/partner/${orderId}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`Order marked as ${newStatus}!`);
        fetchPartnerData();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            Delivery Partner Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Rider {user?.fullName || "Express"}</h1>
          <p className="text-sm text-white/90">
            Earn ₹40 per delivery + 100% customer tips deposited instantly to your wallet.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              toast.success(`You are now ${!isOnline ? "ONLINE" : "OFFLINE"}`);
            }}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow transition ${
              isOnline ? "bg-green-500 text-white animate-pulse" : "bg-slate-700 text-slate-300"
            }`}
          >
            {isOnline ? "🟢 ON DUTY" : "🔴 OFF DUTY"}
          </button>
          <button
            onClick={fetchPartnerData}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center font-bold">
            <DollarSign size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Available Wallet Balance</p>
          <p className="text-2xl font-black text-green-600">₹{user?.walletBalance || 1200}</p>
        </div>

        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <Bike size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Completed Deliveries</p>
          <p className="text-2xl font-black">{myDeliveries.filter((d) => d.orderStatus === "Delivered").length || 18}</p>
        </div>

        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Rider Rating</p>
          <p className="text-2xl font-black">4.9 ⭐</p>
        </div>
      </div>

      {/* Available Orders Broadcast */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Navigation className="text-blue-500" /> Available Delivery Broadcast Queue
        </h2>

        {availableOrders.length === 0 ? (
          <div className="bg-(--bg-surface) p-8 rounded-3xl border border-(--border-color) text-center space-y-2">
            <p className="font-bold">No new broadcast orders ready right now</p>
            <p className="text-xs text-(--text-muted)">Orders will appear automatically when restaurants finish cooking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableOrders.map((ord) => (
              <div key={ord._id} className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold text-xs">
                      #{ord.orderId}
                    </span>
                    <h3 className="font-bold text-base mt-2">{ord.restaurantId?.name}</h3>
                    <p className="text-xs text-(--text-muted) flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {ord.restaurantId?.address?.street || "Bandra West"}
                    </p>
                  </div>
                  <span className="font-black text-green-600 text-base">Earn ₹40</span>
                </div>

                <div className="pt-3 border-t border-(--border-color) flex items-center justify-between">
                  <span className="text-xs font-semibold text-(--text-secondary)">
                    Customer: {ord.customerId?.fullName || "Rohan Sharma"}
                  </span>
                  <button
                    onClick={() => handleAcceptOrder(ord._id)}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-700 transition"
                  >
                    Accept Delivery Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Deliveries */}
      <div className="space-y-6 pt-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="text-green-500" /> My Assigned Delivery Jobs
        </h2>

        {myDeliveries.length === 0 ? (
          <div className="bg-(--bg-surface) p-8 rounded-3xl border border-(--border-color) text-center space-y-2">
            <p className="font-bold">You currently have no active deliveries</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myDeliveries.map((ord) => (
              <div key={ord._id} className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Order #{ord.orderId}</span>
                  <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 font-bold text-xs">
                    {ord.orderStatus}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p><strong className="text-(--text-primary)">Pickup:</strong> {ord.restaurantId?.name}</p>
                  <p><strong className="text-(--text-primary)">Drop:</strong> {ord.deliveryAddress?.street}</p>
                  <p><strong className="text-(--text-primary)">Amount:</strong> ₹{ord.pricing?.totalAmount} ({ord.paymentMethod})</p>
                </div>

                {ord.orderStatus !== "Delivered" && (
                  <div className="pt-3 border-t border-(--border-color) flex gap-2">
                    {ord.orderStatus === "Ready for Pickup" && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(ord._id, "Out for Delivery")}
                        className="flex-1 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
                      >
                        Picked Up (Out for Delivery)
                      </button>
                    )}
                    {ord.orderStatus === "Out for Delivery" && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(ord._id, "Delivered")}
                        className="flex-1 py-2 rounded-xl bg-green-600 text-white font-bold text-xs"
                      >
                        Complete Delivery (+₹40)
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;
