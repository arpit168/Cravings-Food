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
    } catch (error) {}
  };

  const handleApplyCouponCode = async (codeToApply) => {
    try {
      const res = await api.post("/coupons/validate", {
        code: codeToApply,
        amount: totals.itemTotal,
      });
      if (res.data && res.data.success) {
        const found = availableCoupons.find((c) => c.code === codeToApply.toUpperCase()) || {
          code: codeToApply.toUpperCase(),
          discountPercentage: 25,
          maxDiscountAmount: res.data.data.discount,
        };
        applyCoupon(found);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid coupon code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await api.post("/orders", {
        restaurantId: restaurant._id,
        items: items.map((i) => ({
          menuItemId: i.menuItemId || i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          isVeg: i.isVeg,
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
        couponCode: coupon?.code || "",
        specialInstructions,
      });

      if (res.data && res.data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/order-tracking/${res.data.data._id}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error placing order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto text-4xl">
          🛍️
        </div>
        <h2 className="text-3xl font-black">Your cart is empty</h2>
        <p className="text-(--text-muted) max-w-sm mx-auto text-sm">
          Good food is always cooking! Go ahead and order some scrumptious meals from top restaurants nearby.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-600/30 hover:bg-orange-700 transition"
        >
          Explore Restaurants <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black tracking-tight mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Address, Payment, Instructions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Address */}
          <div className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MapPin className="text-orange-500" /> Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(user?.addresses?.length > 0
                ? user.addresses
                : [selectedAddress]
              ).map((addr, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    selectedAddress?.street === addr.street
                      ? "border-orange-500 bg-orange-500/5"
                      : "border-(--border-color) hover:border-orange-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase">
                      {addr.label}
                    </span>
                    {selectedAddress?.street === addr.street && (
                      <CheckCircle2 size={18} className="text-orange-500" />
                    )}
                  </div>
                  <p className="font-semibold text-sm mt-2">{addr.street}</p>
                  <p className="text-xs text-(--text-muted)">
                    {addr.city}, {addr.state} - {addr.zip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Utensils className="text-orange-500" /> Kitchen / Delivery Instructions
            </h2>
            <textarea
              rows={2}
              placeholder="E.g. Avoid extra onions, leave order at main gate, ring doorbell twice..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-4 rounded-2xl bg-(--bg-secondary) border border-(--border-color) text-sm outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Payment Method */}
          <div className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="text-orange-500" /> Select Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "COD", label: "Cash on Delivery", icon: "💵", desc: "Pay cash upon delivery" },
                { id: "Stripe", label: "Credit / Debit Card", icon: "💳", desc: "Instant secure Stripe pay" },
                {
                  id: "Wallet",
                  label: `Cravings Wallet (₹${user?.walletBalance || 0})`,
                  icon: "👛",
                  desc: "Instant 1-click checkout",
                },
              ].map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    paymentMethod === pm.id
                      ? "border-orange-500 bg-orange-500/5"
                      : "border-(--border-color) hover:border-orange-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{pm.icon}</span>
                    {paymentMethod === pm.id && <CheckCircle2 size={18} className="text-orange-500" />}
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-sm">{pm.label}</p>
                    <p className="text-xs text-(--text-muted) mt-0.5">{pm.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Bill Breakdown */}
        <div className="space-y-6">
          <div className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-6 shadow-xl sticky top-24">
            {/* Restaurant Name */}
            <div className="flex items-center justify-between border-b border-(--border-color) pb-4">
              <div>
                <h3 className="font-extrabold text-lg truncate max-w-[200px]">{restaurant?.name}</h3>
                <p className="text-xs text-(--text-muted) flex items-center gap-1 mt-0.5">
                  <Clock size={12} /> Est. Delivery: {restaurant?.deliveryTime}
                </p>
              </div>
              <img
                src={restaurant?.image}
                alt={restaurant?.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            </div>

            {/* Cart Items List */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.menuItemId || item._id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {item.isVeg ? (
                      <span className="w-3 h-3 rounded-sm border border-green-600 flex items-center justify-center p-[1px] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      </span>
                    ) : (
                      <span className="w-3 h-3 rounded-sm border border-red-600 flex items-center justify-center p-[1px] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      </span>
                    )}
                    <span className="font-semibold truncate">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-(--bg-secondary) border border-(--border-color) text-xs font-bold">
                      <button onClick={() => updateQuantity(item.menuItemId || item._id, -1)}>
                        <Minus size={11} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.menuItemId || item._id, 1)}>
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="font-bold w-12 text-right">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="pt-2 border-t border-(--border-color) space-y-3">
              {coupon ? (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xs">
                    <Tag size={14} /> Coupon '{coupon.code}' applied! (-₹{totals.discount})
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 hover:scale-110 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. WELCOME50)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-(--bg-secondary) border border-(--border-color) text-xs uppercase font-bold outline-none"
                    />
                    <button
                      onClick={() => handleApplyCouponCode(couponInput)}
                      className="px-4 py-2 rounded-xl bg-(--bg-secondary) border border-(--border-color) font-bold text-xs hover:border-orange-500 transition"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Available coupons list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleApplyCouponCode(c.code)}
                        className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold uppercase hover:scale-105 transition"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bill Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-(--border-color) text-sm">
              <div className="flex justify-between text-(--text-secondary)">
                <span>Item Total</span>
                <span>₹{totals.itemTotal}</span>
              </div>
              <div className="flex justify-between text-(--text-secondary)">
                <span>Delivery Partner Fee</span>
                <span>{totals.deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${totals.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-(--text-secondary)">
                <span>Restaurant Packaging</span>
                <span>₹{totals.packagingFee}</span>
              </div>
              <div className="flex justify-between text-(--text-secondary)">
                <span>GST (5%)</span>
                <span>₹{totals.gst}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-(--border-color) flex justify-between font-black text-lg text-(--text-primary)">
                <span>To Pay</span>
                <span className="text-orange-600 dark:text-orange-400">₹{totals.totalAmount}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-600/30 hover:opacity-95 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {placingOrder ? "Placing Order..." : `PLACE ORDER • ₹${totals.totalAmount}`}
            </button>

            <p className="text-[11px] text-center text-(--text-muted) flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-green-500" /> 100% Safe & Hygienic Delivery Guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
