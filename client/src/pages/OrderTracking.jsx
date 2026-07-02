import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/Api";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  FileText,
  Bike,
  UtensilsCrossed,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 8000); // Polling every 8s
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data && res.data.data) {
        setOrder(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6 bg-background">
        <div className="h-48 bg-surface rounded-3xl border border-border"></div>
        <div className="h-64 bg-surface rounded-3xl border border-border"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-background">
        <h2 className="text-2xl font-bold text-text-primary">Order not found</h2>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition">
          Return Home
        </Link>
      </div>
    );
  }

  const steps = [
    { status: "Placed", label: "Order Received", icon: ShoppingBag, desc: "Order placed & verified" },
    { status: "Preparing", label: "Kitchen Cooking", icon: UtensilsCrossed, desc: "Chef preparing food" },
    { status: "Ready for Pickup", label: "Packed & Hot", icon: Sparkles, desc: "Waiting for rider" },
    { status: "Out for Delivery", label: "Rider En Route", icon: Bike, desc: "Heading to your door" },
    { status: "Delivered", label: "Enjoy Your Meal!", icon: CheckCircle2, desc: "Successfully delivered" },
  ];

  const currentStepIdx = steps.findIndex((s) => s.status === order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary mb-2 transition">
            <ArrowLeft size={14} /> Back to Directory
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary flex items-center gap-3">
            Order #{order.orderId}
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <div className="text-right">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-wider border border-primary/20">
            {order.orderStatus}
          </span>
          <p className="text-xs text-text-muted mt-1">Live Auto-Updating</p>
        </div>
      </div>

      {/* RADAR MAP SIMULATION */}
      <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-secondary text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fc8019_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              Live Radar Telemetry
            </span>
            <h3 className="text-xl font-black mt-2">Estimated Arrival: 18 Minutes</h3>
          </div>
          <button
            onClick={fetchOrderDetails}
            className="p-2.5 rounded-xl bg-surface border border-border hover:border-primary transition text-text-secondary"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Animated Rider Marker */}
        <div className="relative z-10 flex items-center justify-center my-auto">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-primary opacity-30"></span>
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl text-2xl animate-bounce">
              🛵
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs font-semibold bg-surface/90 backdrop-blur-md text-text-primary p-3.5 rounded-2xl border border-border">
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-primary" /> {order.restaurantId?.name}
          </span>
          <span className="font-bold">➔</span>
          <span className="flex items-center gap-2 truncate max-w-[200px]">
            <CheckCircle2 size={15} className="text-success" /> {order.deliveryAddress?.street}
          </span>
        </div>
      </div>

      {/* STEPPER */}
      <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-6 shadow-xs">
        <h2 className="text-lg font-black text-text-primary">Order Progress Tracker</h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={st.status} className="relative flex sm:flex-col items-center gap-3 text-center">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                    isCurrent
                      ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                      : isDone
                      ? "bg-success text-white"
                      : "bg-muted text-text-muted"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="text-left sm:text-center min-w-0">
                  <h4 className={`text-xs font-bold ${isDone ? "text-text-primary" : "text-text-muted"}`}>
                    {st.label}
                  </h4>
                  <p className="text-[11px] text-text-muted">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface p-6 rounded-3xl border border-border space-y-4 shadow-xs">
          <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary border-b border-border pb-3">
            Items Ordered
          </h3>
          <div className="divide-y divide-border text-sm">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <span className="font-bold text-text-primary">
                  {item.quantity}x {item.menuItem?.name || "Gourmet Dish"}
                </span>
                <span className="font-black text-text-primary">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-4 shadow-xs">
          <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary border-b border-border pb-3">
            Payment Summary
          </h3>
          <div className="space-y-2.5 text-xs font-semibold text-text-secondary">
            <div className="flex justify-between">
              <span>Payment Mode</span>
              <span className="font-bold text-text-primary uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid</span>
              <span className="text-lg font-black text-primary">₹{order.pricing?.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
