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
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-48 bg-(--bg-surface) rounded-3xl border border-(--border-color)"></div>
        <div className="h-64 bg-(--bg-surface) rounded-3xl border border-(--border-color)"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm">
          Return Home
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", status: ["Placed", "Confirmed", "Preparing", "Ready for Pickup", "Out for Delivery", "Delivered"], icon: ShoppingBag, desc: "Order transmitted to restaurant" },
    { label: "Kitchen Preparing", status: ["Preparing", "Ready for Pickup", "Out for Delivery", "Delivered"], icon: UtensilsCrossed, desc: "Chef is crafting your meal with care" },
    { label: "Out for Delivery", status: ["Out for Delivery", "Delivered"], icon: Bike, desc: "Partner is riding to your location" },
    { label: "Delivered", status: ["Delivered"], icon: CheckCircle2, desc: "Enjoy your hot Cravings meal!" },
  ];

  const currentStatus = order.orderStatus;
  const isDelivered = currentStatus === "Delivered";
  const isCancelled = currentStatus === "Cancelled";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/userDashboard" className="inline-flex items-center gap-2 text-xs font-bold text-(--text-muted) hover:text-orange-500 mb-2">
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Order #{order.orderId}
          </h1>
          <p className="text-xs text-(--text-muted)">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider ${
            isDelivered ? "bg-green-500/15 text-green-600 border border-green-500/30" :
            isCancelled ? "bg-red-500/15 text-red-600 border border-red-500/30" :
            "bg-orange-500/15 text-orange-600 border border-orange-500/30 animate-pulse"
          }`}>
            {currentStatus}
          </span>

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-(--bg-surface) border border-(--border-color) hover:border-orange-500 transition text-(--text-secondary)"
            title="Print Invoice"
          >
            <FileText size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Radar Map & Stepper */}
        <div className="lg:col-span-2 space-y-8">
          {/* Simulated Live Radar Map */}
          <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-(--border-color) shadow-xl bg-slate-900 flex items-center justify-center">
            {/* Map grid background pattern */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Radar Sweep Effect */}
            <div className="absolute w-72 h-72 rounded-full border border-orange-500/30 animate-ping"></div>
            <div className="absolute w-48 h-48 rounded-full border border-orange-500/50"></div>

            {/* Pins */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-4/5 gap-8">
              {/* Restaurant Pin */}
              <div className="flex items-center gap-3 bg-(--bg-card) p-3 rounded-2xl border border-(--border-color) shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                  🍔
                </div>
                <div>
                  <p className="text-xs font-bold text-(--text-primary)">{order.restaurantId?.name || "Restaurant"}</p>
                  <p className="text-[10px] text-(--text-muted)">Preparation Hub</p>
                </div>
              </div>

              {/* Driver moving pin indicator */}
              {!isDelivered && !isCancelled && (
                <div className="flex flex-col items-center gap-1 animate-bounce">
                  <div className="px-3 py-1 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                    Rider en route • ETA {order.estimatedDeliveryTime}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-600 flex items-center justify-center shadow-xl text-lg">
                    🏍️
                  </div>
                </div>
              )}

              {/* Customer Destination Pin */}
              <div className="flex items-center gap-3 bg-(--bg-card) p-3 rounded-2xl border border-(--border-color) shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">
                  🏠
                </div>
                <div>
                  <p className="text-xs font-bold text-(--text-primary)">Delivery Destination</p>
                  <p className="text-[10px] text-(--text-muted)">{order.deliveryAddress?.street?.slice(0, 20)}...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-6 shadow-sm">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Clock className="text-orange-500" /> Real-Time Order Timeline
            </h3>

            <div className="space-y-6 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-(--border-color)">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isCompleted = st.status.includes(currentStatus);

                return (
                  <div key={idx} className="flex items-start gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                        : "bg-(--bg-secondary) border border-(--border-color) text-(--text-muted)"
                    }`}>
                      <Icon size={18} />
                    </div>

                    <div className="pt-1">
                      <h4 className={`font-bold text-sm ${isCompleted ? "text-(--text-primary)" : "text-(--text-muted)"}`}>
                        {st.label}
                      </h4>
                      <p className="text-xs text-(--text-muted) mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Driver Details & Bill Summary */}
        <div className="space-y-6">
          {/* Delivery Partner Details */}
          <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-(--text-muted)">Your Delivery Partner</h3>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                <img
                  src={order.deliveryPartnerId?.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200"}
                  alt="Delivery Partner"
                  className="w-12 h-12 rounded-2xl object-cover border border-(--border-color)"
                />
                <div>
                  <p className="font-bold text-sm">{order.deliveryPartnerId?.fullName || "Rahul Delivery Express"}</p>
                  <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <Sparkles size={12} /> Vaccinated & Top Rated (4.9★)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`tel:${order.deliveryPartnerId?.mobileNumber || "9876543212"}`}
                className="flex-1 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-600 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Phone size={14} /> Call Partner
              </a>
              <button
                onClick={() => alert("Partner chat feature activated. Your message will be sent via SMS notification.")}
                className="flex-1 py-2.5 rounded-xl bg-(--bg-secondary) hover:bg-(--border-color) font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageSquare size={14} /> Chat
              </button>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-(--text-muted)">Order Items Summary</h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-sm">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-2">
                  <span className="font-medium truncate">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-bold shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-(--border-color) space-y-2 text-xs text-(--text-secondary)">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-bold text-(--text-primary)">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className={`font-bold ${order.paymentStatus === "Paid" ? "text-green-600" : "text-amber-500"}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between font-black text-base text-(--text-primary) pt-2 border-t border-(--border-color)">
                <span>Total Amount Paid</span>
                <span className="text-orange-600">₹{order.pricing?.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
