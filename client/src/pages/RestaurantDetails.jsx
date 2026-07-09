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
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-pulse bg-background">
        <div className="h-64 bg-surface rounded-3xl border border-border"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface rounded-2xl border border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-background">
        <h2 className="text-2xl font-bold text-text-primary">Restaurant not found</h2>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition">
          Back to Home
        </Link>
      </div>
    );
  }

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-32 bg-background transition-colors duration-300">
      {/* RESTAURANT HEADER BANNER */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/80 backdrop-blur-md text-text-primary text-xs font-bold mb-4 border border-border hover:bg-surface transition"
            >
              <ArrowLeft size={14} /> Back to Directory
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
                    {restaurant.name}
                  </h1>
                  {restaurant.isPureVeg && (
                    <span className="px-3 py-1 rounded-full bg-success text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Leaf size={12} /> Pure Veg Kitchen
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-text-secondary">
                  {restaurant.cuisines?.join(", ")} • Linking Road, Bandra West
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-surface p-3.5 rounded-2xl border border-border flex items-center gap-3 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-success text-white flex items-center justify-center font-black text-base shadow-xs">
                    {restaurant.rating} <Star size={12} className="fill-white ml-0.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase">Verified Rating</p>
                    <p className="text-xs font-black text-text-primary">500+ Orders Served</p>
                  </div>
                </div>

                <div className="bg-surface p-3.5 rounded-2xl border border-border space-y-0.5 shadow-md">
                  <p className="text-xs font-bold text-text-muted uppercase flex items-center gap-1">
                    <Clock size={12} className="text-primary" /> Delivery Time
                  </p>
                  <p className="text-sm font-black text-text-primary">{restaurant.deliveryTime} mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU NAVIGATION & FILTERS */}
      <div className="sticky top-20 z-40 bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface border border-border text-text-secondary hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg Only Switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none self-start sm:self-auto px-3.5 py-2 rounded-xl bg-surface border border-border">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="w-4 h-4 rounded text-success focus:ring-success"
            />
            <span className="text-xs font-bold text-text-primary flex items-center gap-1">
              <Leaf size={14} className="text-success" /> Pure Veg Only
            </span>
          </label>
        </div>
      </div>

      {/* MENU LISTINGS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h2 className="text-xl font-black text-text-primary flex items-center gap-2">
          <Flame className="text-primary fill-primary" /> Signature Menu Items ({filteredItems.length})
        </h2>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-3xl border border-border p-8 space-y-3">
            <p className="font-bold text-base text-text-primary">No dishes found in this filter</p>
            <button
              onClick={() => { setSelectedCategory("All"); setVegOnly(false); }}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition"
            >
              Show All Menu Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => {
              const cartItem = items.find((ci) => ci._id === item._id);
              const qty = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={item._id}
                  className="bg-surface p-4 sm:p-5 rounded-3xl border border-border flex justify-between gap-4 shadow-xs hover:shadow-md transition"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                        item.isVeg ? "border-success text-success" : "border-danger text-danger"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-success" : "bg-danger"}`}></span>
                      </span>

                      {item.isBestseller && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-black text-[10px] uppercase">
                          ⭐ Bestseller
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-text-primary truncate">{item.name}</h3>
                    <p className="font-black text-primary text-base">₹{item.price}</p>
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {item.description || "Freshly cooked with authentic Indian gourmet ingredients and signature spices."}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-border shadow-xs"
                    />

                    <div className="-mt-5 relative z-10">
                      {qty === 0 ? (
                        <button
                          onClick={() => addItem(item, restaurant)}
                          className="px-6 py-2 rounded-xl bg-surface border-2 border-primary text-primary font-black text-xs uppercase tracking-wider shadow-md hover:bg-primary hover:text-white transition cursor-pointer"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-primary text-white font-black text-xs shadow-md">
                          <button onClick={() => updateQuantity(item._id, qty - 1)} className="hover:opacity-80">
                            <Minus size={14} />
                          </button>
                          <span>{qty}</span>
                          <button onClick={() => updateQuantity(item._id, qty + 1)} className="hover:opacity-80">
                            <Plus size={14} />
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

      {/* FLOATING CART BAR */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4">
          <div className="max-w-2xl mx-auto bg-primary text-white p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center justify-between border border-primary-hover animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="font-black text-base">{totalItems} {totalItems === 1 ? "item" : "items"} added</p>
                <p className="text-xs text-white/90">Extra charges may apply • Total ₹{totalAmount}</p>
              </div>
            </div>

            <Link
              to="/checkout"
              className="px-6 py-3 rounded-xl bg-white text-primary font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:bg-muted transition"
            >
              Proceed to Cart →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
