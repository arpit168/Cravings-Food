import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/Api";
import useCartStore from "../stores/useCartStore";
import { Star, Clock, MapPin, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Flame, Leaf } from "lucide-react";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);

  const { items, addItem, updateQuantity, getCartTotals } = useCartStore();
  const { totalItems, totalAmount } = getCartTotals();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/restaurants/${id}`);
      if (res.data && res.data.data) {
        setRestaurant(res.data.data.restaurant);
        setMenuItems(res.data.data.menuItems || []);
        setReviews(res.data.data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-64 bg-(--bg-surface) rounded-3xl border border-(--border-color)"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-(--bg-surface) rounded-2xl border border-(--border-color)"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Restaurant not found</h2>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

  const filteredMenu = menuItems.filter((item) => {
    if (vegOnly && !item.isVeg) return false;
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    return true;
  });

  const getItemQuantity = (itemId) => {
    const item = items.find((i) => i.menuItemId === itemId || i._id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Top Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        <img
          src={restaurant.bannerImage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-(--bg-primary) via-black/40 to-black/30"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6 relative z-10">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/50 backdrop-blur-md text-white font-semibold text-xs hover:bg-black/70 transition"
            >
              <ArrowLeft size={16} /> Back to Directory
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {restaurant.offers && restaurant.offers.map((off, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  🎉 {off}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {restaurant.name}
            </h1>

            <p className="text-sm sm:text-base text-white/90 font-medium">
              {restaurant.cuisines?.join(" • ")}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-white/90 pt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-700 text-white font-bold">
                <Star size={13} className="fill-white" /> {restaurant.rating} ({restaurant.totalReviews}+ reviews)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md">
                <Clock size={14} className="text-orange-400" /> {restaurant.deliveryTime}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md">
                <MapPin size={14} className="text-orange-400" /> {restaurant.address?.street}, {restaurant.address?.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--border-color) pb-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                    : "bg-(--bg-surface) border border-(--border-color) text-(--text-secondary) hover:border-orange-500/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pure Veg Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none self-start sm:self-auto px-3.5 py-2 rounded-xl bg-(--bg-surface) border border-(--border-color)">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-(--bg-secondary) rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600 relative"></div>
            <span className="text-xs font-bold flex items-center gap-1">
              <Leaf size={14} className="text-green-600" /> Pure Veg Only
            </span>
          </label>
        </div>

        {/* Menu Items List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">
            {selectedCategory === "All" ? "Full Menu" : selectedCategory} ({filteredMenu.length})
          </h2>

          {filteredMenu.length === 0 ? (
            <div className="text-center py-16 bg-(--bg-surface) rounded-3xl border border-(--border-color) p-8 space-y-3">
              <p className="text-lg font-bold">No dishes matching this filter</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setVegOnly(false);
                }}
                className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
              >
                Show Full Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenu.map((item) => {
                const quantity = getItemQuantity(item._id);

                return (
                  <div
                    key={item._id}
                    className="bg-(--bg-surface) p-4 sm:p-5 rounded-3xl border border-(--border-color) flex justify-between gap-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* Item Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {item.isVeg ? (
                          <span className="w-4 h-4 rounded border-2 border-green-600 flex items-center justify-center p-0.5" title="Pure Veg">
                            <span className="w-2 h-2 rounded-full bg-green-600"></span>
                          </span>
                        ) : (
                          <span className="w-4 h-4 rounded border-2 border-red-600 flex items-center justify-center p-0.5" title="Non-Veg">
                            <span className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-red-600"></span>
                          </span>
                        )}

                        {item.isBestseller && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Flame size={10} /> Bestseller
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-(--text-primary)">{item.name}</h3>
                      <p className="font-black text-sm text-(--text-primary)">₹{item.price}</p>
                      <p className="text-xs text-(--text-muted) line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    {/* Item Image & Action */}
                    <div className="relative w-28 sm:w-32 h-28 sm:h-32 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-2xl border border-(--border-color)"
                      />

                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5">
                        {quantity === 0 ? (
                          <button
                            onClick={() => addItem(item, restaurant)}
                            className="w-full py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 transition active:scale-95 flex items-center justify-center gap-1"
                          >
                            ADD <Plus size={14} />
                          </button>
                        ) : (
                          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-orange-600 text-white font-black text-xs shadow-lg shadow-orange-600/30">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="p-1 hover:bg-black/20 rounded-lg transition"
                            >
                              <Minus size={13} />
                            </button>
                            <span>{quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="p-1 hover:bg-black/20 rounded-lg transition"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:max-w-xl z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="font-extrabold text-sm uppercase tracking-wider">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"} • ₹{totalAmount}
                </p>
                <p className="text-xs text-white/80">From {restaurant.name}</p>
              </div>
            </div>

            <Link
              to="/checkout"
              className="px-6 py-3 rounded-xl bg-white text-orange-600 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-orange-50 transition active:scale-95"
            >
              View Cart & Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
