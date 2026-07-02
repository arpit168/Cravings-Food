import React, { useState, useEffect } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  UtensilsCrossed,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  ListOrdered,
  DollarSign,
  ChefHat,
  RefreshCw,
} from "lucide-react";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [myRestaurants, setMyRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Item Form
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    price: "",
    category: "Recommended",
    description: "",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    isVeg: true,
  });

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const [resRest, resOrd] = await Promise.all([
        api.get("/restaurants/owner/my-restaurants").catch(() => ({ data: { data: {} } })),
        api.get("/restaurants/owner/orders").catch(() => ({ data: { data: [] } })),
      ]);

      if (resRest.data && resRest.data.data) {
        const rests = resRest.data.data.restaurants || [];
        setMyRestaurants(rests);
        if (rests[0]) setIsStoreOpen(rests[0].isOpen !== false);
        setMenuItems(resRest.data.data.menuItems || []);
      }
      if (resOrd.data && resOrd.data.data) {
        setKitchenOrders(resOrd.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState("");

  const handleToggleStore = async () => {
    try {
      const res = await api.put("/restaurants/owner/toggle-status");
      if (res.data && res.data.success) {
        setIsStoreOpen(res.data.isOpen);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to toggle store status");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/restaurants/owner/orders/${orderId}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`Order marked as ${newStatus}!`);
        fetchOwnerData();
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleToggleItemAvailability = async (itemId) => {
    try {
      const res = await api.put(`/restaurants/owner/menu/${itemId}/availability`);
      if (res.data && res.data.success) {
        toast.success(res.data.message);
        fetchOwnerData();
      }
    } catch (error) {
      toast.error("Failed to update dish availability");
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!payoutAmount || Number(payoutAmount) <= 0) {
      toast.error("Enter a valid payout amount");
      return;
    }
    try {
      const res = await api.post("/restaurants/owner/payout", { amount: Number(payoutAmount) });
      if (res.data && res.data.success) {
        toast.success(res.data.message);
        setPayoutAmount("");
        fetchOwnerData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error requesting payout");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (myRestaurants.length === 0) {
      toast.error("You need at least one active restaurant to add dishes");
      return;
    }

    try {
      const payload = {
        ...newItemForm,
        price: Number(newItemForm.price),
        restaurantId: myRestaurants[0]._id,
      };

      const res = await api.post("/restaurants/menu", payload);
      if (res.data && res.data.success) {
        toast.success("New dish published to kitchen!");
        setNewItemForm({
          name: "",
          price: "",
          category: "Recommended",
          description: "",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
          isVeg: true,
        });
        fetchOwnerData();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding menu item");
    }
  };

  const totalEarnings = kitchenOrders.reduce((sum, ord) => sum + (ord.pricing?.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-background transition-colors duration-300">
      {/* Banner */}
      <div className="bg-surface p-8 rounded-3xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Partner Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-text-primary mt-2">
            Restaurant Owner Control Deck
          </h1>
          <p className="text-sm text-text-secondary">
            Managing <strong className="text-primary">{myRestaurants[0]?.name || "Gourmet Kitchen"}</strong> • Real-time kitchen terminal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleStore}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer ${
              isStoreOpen
                ? "bg-success text-white shadow-success/30"
                : "bg-danger/80 text-white shadow-danger/20"
            }`}
          >
            {isStoreOpen ? "● Store Open" : "○ Store Closed"}
          </button>
          <button
            onClick={fetchOwnerData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-text-primary hover:border-primary/50 transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-primary" : ""} /> Sync Kitchen
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Total Kitchen Revenue</p>
          <p className="text-2xl font-black text-text-primary">₹{totalEarnings}</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ListOrdered size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Kitchen Queue</p>
          <p className="text-2xl font-black text-text-primary">{kitchenOrders.length} Orders</p>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
            <ChefHat size={20} />
          </div>
          <p className="text-xs font-bold uppercase text-text-muted">Active Menu Dishes</p>
          <p className="text-2xl font-black text-text-primary">{menuItems.length} Dishes</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "orders"
              ? "bg-primary text-white shadow-md"
              : "bg-surface border border-border text-text-secondary hover:border-primary/50"
          }`}
        >
          Kitchen Orders Queue ({kitchenOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "menu"
              ? "bg-primary text-white shadow-md"
              : "bg-surface border border-border text-text-secondary hover:border-primary/50"
          }`}
        >
          Menu & Dish Management ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab("payouts")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "payouts"
              ? "bg-primary text-white shadow-md"
              : "bg-surface border border-border text-text-secondary hover:border-primary/50"
          }`}
        >
          Financial Ledger & Payouts
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "orders" ? (
        <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-6 shadow-xs">
          <h2 className="text-lg font-black text-text-primary flex items-center gap-2">
            <Clock className="text-primary" /> Live Ticket Terminal
          </h2>

          <div className="space-y-4">
            {kitchenOrders.length === 0 ? (
              <div className="text-center py-12 bg-background rounded-3xl border border-dashed border-border p-6">
                <p className="text-text-muted font-semibold text-sm">No live tickets in the kitchen right now. Ready for orders!</p>
              </div>
            ) : (
              kitchenOrders.map((ord) => (
                <div
                  key={ord._id}
                  className="bg-background p-6 rounded-3xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-primary">{ord.orderId || ord._id}</span>
                      <span className="text-[11px] text-text-muted">• {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <h3 className="font-bold text-base text-text-primary">
                      {ord.items?.map((i) => `${i.quantity}x ${i.name}`).join(", ") || "Custom Order"}
                    </h3>
                    <p className="font-black text-primary">₹{ord.pricing?.totalAmount || 0}</p>
                    {ord.specialInstructions && (
                      <p className="text-xs bg-amber-500/10 text-amber-500 p-2 rounded-lg font-semibold mt-1">
                        Note: {ord.specialInstructions}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                    <span
                      className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                        ord.orderStatus === "Preparing" || ord.orderStatus === "Placed"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : ord.orderStatus === "Ready for Pickup"
                          ? "bg-info/10 text-info border border-info/20"
                          : "bg-success/10 text-success border border-success/20"
                      }`}
                    >
                      {ord.orderStatus}
                    </span>

                    {ord.orderStatus === "Placed" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateOrderStatus(ord._id, "Preparing")}
                          className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition cursor-pointer"
                        >
                          Accept & Prepare
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord._id, "Cancelled")}
                          className="px-4 py-2 rounded-xl bg-danger/10 text-danger border border-danger/20 font-bold text-xs hover:bg-danger/20 transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {ord.orderStatus === "Preparing" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord._id, "Ready for Pickup")}
                        className="px-4 py-2 rounded-xl bg-success text-white font-bold text-xs hover:bg-success/90 transition cursor-pointer"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : activeTab === "menu" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu List */}
          <div className="lg:col-span-2 bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-text-primary">Published Kitchen Dishes</h2>
            <div className="divide-y divide-border">
              {menuItems.map((item) => (
                <div key={item._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-border" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-text-primary truncate">{item.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.isVeg ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                        }`}>
                          {item.isVeg ? "Veg" : "Non-Veg"}
                        </span>
                      </div>
                      <p className="font-black text-primary text-xs">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      item.isAvailable !== false ? "bg-success/10 text-success" : "bg-muted text-text-muted"
                    }`}>
                      {item.isAvailable !== false ? "In Stock" : "Sold Out"}
                    </span>
                    <button
                      onClick={() => handleToggleItemAvailability(item._id)}
                      className="px-3 py-1.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition cursor-pointer"
                    >
                      Toggle Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Dish Form */}
          <form onSubmit={handleAddItem} className="bg-surface p-6 sm:p-8 rounded-3xl border border-border space-y-4 shadow-xl self-start">
            <h3 className="font-black text-base text-text-primary flex items-center gap-2">
              <PlusCircle className="text-primary" /> Publish New Dish
            </h3>

            <div>
              <label className="text-xs font-bold uppercase text-text-muted">Dish Name</label>
              <input
                type="text"
                required
                value={newItemForm.name}
                onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                placeholder="Truffle Cheese Pizza"
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-text-primary outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-text-muted">Price (₹)</label>
              <input
                type="number"
                required
                value={newItemForm.price}
                onChange={(e) => setNewItemForm({ ...newItemForm, price: e.target.value })}
                placeholder="349"
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-text-primary outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-text-muted">Category</label>
              <select
                value={newItemForm.category}
                onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-xs text-text-primary outline-none focus:border-primary transition font-bold"
              >
                <option value="Recommended">Recommended</option>
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isVeg"
                checked={newItemForm.isVeg}
                onChange={(e) => setNewItemForm({ ...newItemForm, isVeg: e.target.checked })}
                className="w-4 h-4 rounded text-success focus:ring-success"
              />
              <label htmlFor="isVeg" className="text-xs font-bold text-text-primary cursor-pointer">
                Pure Vegetarian Item
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
            >
              Add Dish to Kitchen
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface p-8 rounded-3xl border border-border space-y-6 shadow-xs">
            <h2 className="text-xl font-black text-text-primary flex items-center gap-2">
              <DollarSign className="text-success" /> Financial Payout Ledger
            </h2>
            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
              <span className="text-xs font-bold uppercase text-primary">Available Settlement Balance</span>
              <p className="text-3xl sm:text-4xl font-black text-primary">
                ₹{myRestaurants[0]?.walletBalance || 0}
              </p>
              <p className="text-xs text-text-secondary">
                Standard platform commission is deducted automatically upon order completion.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-text-secondary">Commission Tier</span>
                <span className="text-text-primary font-bold">{myRestaurants[0]?.commissionPercentage || 15}%</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-text-secondary">Settlement Cycle</span>
                <span className="text-text-primary font-bold">24 Hours (NEFT / UPI)</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleRequestPayout} className="bg-surface p-8 rounded-3xl border border-border space-y-4 shadow-xl">
            <h3 className="font-black text-lg text-text-primary">Request Fund Transfer</h3>
            <p className="text-xs text-text-secondary">
              Transfer verified earnings directly to your registered business bank account.
            </p>
            <div>
              <label className="text-xs font-bold uppercase text-text-muted">Withdrawal Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                max={myRestaurants[0]?.walletBalance || 0}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-background border border-border text-sm text-text-primary outline-none focus:border-primary transition font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-success hover:bg-success/90 text-white font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
            >
              Submit Payout Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
