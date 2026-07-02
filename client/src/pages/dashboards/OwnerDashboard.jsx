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
      const res = await api.get("/restaurants/owner/my-restaurants");
      if (res.data && res.data.data) {
        setMyRestaurants(res.data.data.restaurants || []);
        setMenuItems(res.data.data.menuItems || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (myRestaurants.length === 0) {
      toast.error("You need at least one active restaurant to add dishes");
      return;
    }

    try {
      const res = await api.post("/restaurants/menu-item", {
        ...newItemForm,
        restaurantId: myRestaurants[0]._id,
        price: Number(newItemForm.price),
      });
      if (res.data && res.data.success) {
        toast.success("Dish added to your menu!");
        setMenuItems([res.data.data, ...menuItems]);
        setNewItemForm({
          name: "",
          price: "",
          category: "Recommended",
          description: "",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
          isVeg: true,
        });
      }
    } catch (error) {
      toast.error("Error adding dish");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            Restaurant Owner Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Welcome back, Chef {user?.fullName.split(" ")[0]}!</h1>
          <p className="text-sm text-white/90">
            {myRestaurants.length > 0 ? myRestaurants[0].name : "Manage your restaurant kitchen and orders"}
          </p>
        </div>

        <button
          onClick={fetchOwnerData}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-orange-600 font-bold text-xs shadow hover:bg-orange-50 transition"
        >
          <RefreshCw size={14} /> Refresh Live Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <ChefHat size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Active Dishes</p>
          <p className="text-2xl font-black">{menuItems.length}</p>
        </div>

        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center font-bold">
            <DollarSign size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Estimated Revenue</p>
          <p className="text-2xl font-black text-green-600">₹{user?.walletBalance || 2500}</p>
        </div>

        <div className="bg-(--bg-surface) p-6 rounded-3xl border border-(--border-color) space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <TrendingUp size={20} />
          </div>
          <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">Kitchen Rating</p>
          <p className="text-2xl font-black">{myRestaurants[0]?.rating || 4.8} ⭐</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-(--border-color) gap-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "orders"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-(--text-muted) hover:text-(--text-primary)"
          }`}
        >
          <ListOrdered size={16} /> Kitchen Queue
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "menu"
              ? "border-orange-500 text-orange-500"
              : "border-transparent text-(--text-muted) hover:text-(--text-primary)"
          }`}
        >
          <UtensilsCrossed size={16} /> Manage Menu
        </button>
      </div>

      {/* Content */}
      {activeTab === "orders" ? (
        <div className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-6 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="text-orange-500" /> Incoming Live Kitchen Orders
          </h2>
          <p className="text-sm text-(--text-muted)">
            Orders placed by customers will stream here in real-time. When an order is accepted, mark it as 'Preparing' and then 'Ready for Pickup'.
          </p>

          <div className="p-6 rounded-2xl bg-(--bg-secondary) border border-(--border-color) flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-600 font-bold text-xs uppercase">
                Demo Order #CRV-893201
              </span>
              <p className="font-bold text-base mt-2">2x Ultimate Truffle Cheeseburger</p>
              <p className="text-xs text-(--text-muted)">Customer: Rohan Sharma • Amount: ₹653</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toast.success("Order status updated to Preparing!")}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow hover:bg-orange-700 transition"
              >
                Mark Preparing
              </button>
              <button
                onClick={() => toast.success("Order marked Ready for Pickup!")}
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-xs shadow hover:bg-green-700 transition"
              >
                Ready for Pickup
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Dish Form */}
          <form
            onSubmit={handleAddItem}
            className="bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-4 shadow-sm"
          >
            <h3 className="font-bold text-lg flex items-center gap-2">
              <PlusCircle className="text-orange-500" /> Add New Dish
            </h3>

            <div>
              <label className="text-xs font-bold uppercase text-(--text-muted)">Dish Name</label>
              <input
                type="text"
                required
                placeholder="E.g. Loaded Nacho Supreme"
                value={newItemForm.name}
                onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-(--bg-secondary) border border-(--border-color) text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-(--text-muted)">Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="249"
                  value={newItemForm.price}
                  onChange={(e) => setNewItemForm({ ...newItemForm, price: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-(--bg-secondary) border border-(--border-color) text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-(--text-muted)">Category</label>
                <select
                  value={newItemForm.category}
                  onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-(--bg-secondary) border border-(--border-color) text-sm outline-none"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Biryani">Biryani</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Starters">Starters</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-(--text-muted)">Description</label>
              <textarea
                rows={2}
                placeholder="Brief description of flavors & ingredients..."
                value={newItemForm.description}
                onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-(--bg-secondary) border border-(--border-color) text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="radio"
                  name="veg"
                  checked={newItemForm.isVeg}
                  onChange={() => setNewItemForm({ ...newItemForm, isVeg: true })}
                />{" "}
                🌱 Pure Veg
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                <input
                  type="radio"
                  name="veg"
                  checked={!newItemForm.isVeg}
                  onChange={() => setNewItemForm({ ...newItemForm, isVeg: false })}
                />{" "}
                🍗 Non-Veg
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold text-sm shadow hover:bg-orange-700 transition"
            >
              Save Dish to Menu
            </button>
          </form>

          {/* Existing Dishes List */}
          <div className="lg:col-span-2 bg-(--bg-surface) p-6 sm:p-8 rounded-3xl border border-(--border-color) space-y-4 shadow-sm">
            <h3 className="font-bold text-lg">Current Kitchen Menu ({menuItems.length})</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-2xl bg-(--bg-secondary) border border-(--border-color) flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs font-extrabold text-orange-500">₹{item.price}</p>
                      <span className="text-[10px] uppercase text-(--text-muted)">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
