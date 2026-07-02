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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background transition-colors duration-300">
      {/* Banner */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <span className="px-3.5 py-1 rounded-full bg-success/10 text-success font-bold text-xs uppercase tracking-wider">
            Rider Telemetry Console
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">
            Delivery Fleet Terminal
          </h1>
          <p className="text-sm text-text-secondary">
            Rider <strong className="text-primary">{user?.fullName}</strong> • Active Zone: Bandra West GPS
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              toast.success(`Status shifted to ${!isOnline ? "ONLINE" : "OFFLINE"}`);
            }}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer ${
              isOnline
                ? "bg-success text-white shadow-success/30"
                : "bg-muted text-text-muted border border-border"
            }`}
          >
            {isOnline ? "● Online & Ready" : "○ Offline"}
          </button>

          <button
            onClick={fetchPartnerData}
            className="p-2.5 rounded-xl bg-muted border border-border text-text-secondary hover:text-primary transition cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-primary" : ""} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Completed Earnings</p>
          <p className="text-2xl font-black text-text-primary">₹{(user?.walletBalance || 0) + myDeliveries.filter(d => d.orderStatus === "Delivered").length * 40}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Bike size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Available Broadcasts</p>
          <p className="text-2xl font-black text-text-primary">{availableOrders.length} Orders</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Active Deliveries</p>
          <p className="text-2xl font-black text-text-primary">{myDeliveries.length} Ongoing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Orders */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
            <Navigation className="text-primary" /> Live Pickup Requests ({availableOrders.length})
          </h2>

          {availableOrders.length === 0 ? (
            <div className="bg-surface p-8 rounded-3xl border border-border text-center space-y-2">
              <p className="font-bold text-text-primary">No nearby orders currently waiting for rider</p>
              <p className="text-xs text-text-muted">Stay online in peak areas (Linking Road, Pali Hill) to receive broadcast dispatches.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableOrders.map((ord) => (
                <div key={ord._id} className="bg-surface p-6 rounded-3xl border border-border space-y-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-xs text-primary">#{ord.orderId || ord._id}</span>
                      <h4 className="font-bold text-base text-text-primary mt-1">{ord.restaurantId?.name || "Kitchen"}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-success/10 text-success font-black text-sm">
                      Earn ₹80
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-semibold text-text-secondary bg-muted p-3.5 rounded-2xl border border-border">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary" /> Pickup: {ord.restaurantId?.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-success" /> Dropoff: {ord.deliveryAddress?.street}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAcceptOrder(ord._id)}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    Accept Delivery Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Deliveries */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
            <Bike className="text-success" /> My Assigned Deliveries ({myDeliveries.length})
          </h2>

          {myDeliveries.length === 0 ? (
            <div className="bg-surface p-8 rounded-3xl border border-border text-center space-y-2">
              <p className="font-bold text-text-primary">You have no active deliveries</p>
              <p className="text-xs text-text-muted">Accept incoming pickup requests from the left column to begin navigation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myDeliveries.map((ord) => (
                <div key={ord._id} className="bg-surface p-6 rounded-3xl border border-border space-y-4 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-xs text-success">Active Run</span>
                      <h4 className="font-bold text-base text-text-primary mt-1">Order #{ord.orderId || ord._id}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-info/10 text-info font-bold text-xs uppercase">
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-semibold text-text-secondary bg-muted p-3.5 rounded-2xl border border-border">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary" /> Dropoff: {ord.deliveryAddress?.street}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={14} className="text-info" /> Total Bill: ₹{ord.pricing?.totalAmount} ({ord.paymentMethod})
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {ord.orderStatus !== "Out for Delivery" && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(ord._id, "Out for Delivery")}
                        className="flex-1 py-3 rounded-xl bg-info text-white font-black text-xs uppercase tracking-wider transition hover:opacity-90 cursor-pointer"
                      >
                        Picked Up
                      </button>
                    )}
                    {ord.orderStatus !== "Delivered" && (
                      <button
                        onClick={() => handleUpdateDeliveryStatus(ord._id, "Delivered")}
                        className="flex-1 py-3 rounded-xl bg-success text-white font-black text-xs uppercase tracking-wider transition hover:opacity-90 cursor-pointer"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
