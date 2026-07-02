import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/Api";
import useCartStore from "../stores/useCartStore";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Wallet,
  CheckCircle2,
  Tag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Clock,
} from "lucide-react";

const CartCheckout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    items,
    restaurant,
    coupon,
    specialInstructions,
    setSpecialInstructions,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
    getCartTotals,
  } = useCartStore();

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponInput, setCouponInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(
    user?.addresses?.[0] || {
      label: "Home",
      street: "Flat 402, Sunshine Towers, Linking Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400050",
    }
  );
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  const totals = getCartTotals();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      if (res.data && res.data.data) {
        setAvailableCoupons(res.data.data);
      }
    } catch (error) {
    }
  };

  const handleApplyCouponCode = async (code) => {
    if (!code) return;
    try {
      const res = await api.post("/coupons/validate", {
        code,
        orderAmount: totals.itemTotal,
      });
      if (res.data && res.data.success) {
        applyCoupon(res.data.data);
        toast.success(`Coupon ${code} applied successfully!`);
        setCouponInput("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid or expired coupon");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    if (paymentMethod === "Wallet" && (user.walletBalance || 0) < totals.finalTotal) {
      toast.error("Insufficient wallet balance. Please switch payment method.");
      return;
    }

    try {
      setPlacingOrder(true);
      const payload = {
        restaurantId: restaurant._id,
        items: items.map((i) => ({
          menuItem: i._id,
          quantity: i.quantity,
          price: i.price,
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
        couponCode: coupon?.code || null,
        specialInstructions,
      };

      const res = await api.post("/orders", payload);
      if (res.data && res.data.success) {
        toast.success("Order Placed Successfully!");
        clearCart();
        navigate(`/order-tracking/${res.data.data._id}`);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error?.response?.data?.message || "Error placing order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6 bg-background">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto text-3xl font-bold shadow-md">
          🛒
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-text-primary">Your cart is empty</h2>
          <p className="text-sm text-text-muted">
            Looks like you haven't added any gourmet delights to your bag yet.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:bg-primary-hover transition"
        >
          Explore Restaurants <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary">Secure Checkout</h1>
          <p className="text-sm text-text-secondary mt-1">
            Ordering from <strong className="text-primary">{restaurant?.name}</strong> • Linking Road
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 font-bold text-xs transition"
        >
          <Trash2 size={14} /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Items & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart Items */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
              <ShoppingBag className="text-primary" size={20} /> Order Summary ({totals.totalItems} items)
            </h2>

            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-border" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-text-primary truncate">{item.name}</h4>
                      <p className="text-xs font-semibold text-text-muted">₹{item.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted border border-border">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-text-secondary hover:text-primary">
                        <Minus size={13} />
                      </button>
                      <span className="font-black text-xs px-1 text-text-primary">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-text-secondary hover:text-primary">
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className="font-black text-sm w-16 text-right text-text-primary">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="text"
                placeholder="Special cooking instructions (e.g. less spicy, extra ketchup)..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-xs font-semibold text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
              <MapPin className="text-primary" size={20} /> Delivery Address
            </h2>

            <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary flex items-start gap-3">
              <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
              <div className="space-y-0.5">
                <span className="px-2 py-0.5 rounded bg-primary text-white font-bold text-[10px] uppercase">
                  {selectedAddress.label}
                </span>
                <p className="font-bold text-sm text-text-primary mt-1">{selectedAddress.street}</p>
                <p className="text-xs text-text-secondary">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
              <CreditCard className="text-primary" size={20} /> Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "COD", label: "Cash on Delivery", icon: "💵" },
                { id: "Card", label: "Stripe / Card", icon: "💳" },
                { id: "Wallet", label: `Wallet (₹${user?.walletBalance || 1200})`, icon: "👛" },
              ].map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition cursor-pointer ${
                    paymentMethod === pm.id
                      ? "bg-primary/10 border-primary shadow-md"
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{pm.icon}</span>
                  <span className="font-bold text-xs text-text-primary">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Bill Breakdown & Promo */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="bg-surface p-6 rounded-3xl border border-border space-y-4 shadow-xs">
            <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Tag className="text-primary" size={16} /> Offers & Coupons
            </h3>

            {coupon ? (
              <div className="p-4 rounded-2xl bg-success/10 border border-success flex items-center justify-between">
                <div>
                  <span className="font-black text-success text-sm">{coupon.code}</span>
                  <p className="text-xs text-text-secondary">Coupon applied successfully</p>
                </div>
                <button onClick={removeCoupon} className="text-xs font-bold text-danger hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code..."
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-text-primary uppercase outline-none focus:border-primary transition"
                />
                <button
                  onClick={() => handleApplyCouponCode(couponInput)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase transition hover:bg-primary-hover cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}

            {availableCoupons.length > 0 && !coupon && (
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-[11px] font-bold text-text-muted uppercase">Available Promo Codes</p>
                <div className="space-y-2">
                  {availableCoupons.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => handleApplyCouponCode(c.code)}
                      className="p-3 rounded-xl bg-muted border border-dashed border-border hover:border-primary flex justify-between items-center cursor-pointer transition"
                    >
                      <div>
                        <span className="font-black text-xs text-primary">{c.code}</span>
                        <p className="text-[11px] text-text-secondary">{c.description}</p>
                      </div>
                      <span className="text-[11px] font-bold text-primary">TAP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bill Total Card */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-4 shadow-xl sticky top-28">
            <h3 className="font-black text-lg text-text-primary border-b border-border pb-3">
              Bill Breakdown
            </h3>

            <div className="space-y-2.5 text-xs font-semibold text-text-secondary">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="text-text-primary">₹{totals.itemTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className={totals.deliveryFee === 0 ? "text-success font-bold" : "text-text-primary"}>
                  {totals.deliveryFee === 0 ? "FREE" : `₹${totals.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant Packaging Fee</span>
                <span className="text-text-primary">₹{totals.packagingFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Government Taxes (5%)</span>
                <span className="text-text-primary">₹{totals.gst}</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-success font-bold pt-1">
                  <span>Coupon Discount</span>
                  <span>-₹{totals.discountAmount}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-baseline">
              <span className="font-bold text-sm text-text-primary">To Pay</span>
              <span className="text-2xl font-black text-primary">₹{totals.finalTotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-4 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/30 hover:bg-primary-hover transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {placingOrder ? "Processing..." : `Place Order • ₹${totals.finalTotal}`} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
