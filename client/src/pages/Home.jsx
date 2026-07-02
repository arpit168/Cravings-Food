import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/Api";
import { Search, Star, Clock, Flame, ShieldCheck, Sparkles, Filter, Leaf, ArrowRight, TrendingUp } from "lucide-react";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const cuisines = [
    { name: "All", icon: "🍽️" },
    { name: "Burgers", icon: "🍔" },
    { name: "Biryani", icon: "🍛" },
    { name: "Pizza", icon: "🍕" },
    { name: "South Indian", icon: "🥞" },
    { name: "Chinese", icon: "🥟" },
    { name: "Desserts", icon: "🍨" },
  ];

  useEffect(() => {
    fetchRestaurants();
  }, [searchTerm, activeFilter, selectedCuisine]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      let query = `?`;
      if (searchTerm) query += `search=${encodeURIComponent(searchTerm)}&`;
      if (selectedCuisine !== "All") query += `cuisine=${encodeURIComponent(selectedCuisine)}&`;
      if (activeFilter === "PureVeg") query += `isPureVeg=true&`;
      if (activeFilter === "TopRated") query += `rating=4.5&`;
      if (activeFilter === "Fastest") query += `sortBy=deliveryTime&`;

      const res = await api.get(`/restaurants${query}`);
      if (res.data && res.data.data) {
        setRestaurants(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-500/10 via-(--bg-primary) to-(--bg-primary)">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider animate-bounce">
            <Sparkles size={14} /> Lightning Fast 20-Min Delivery in Bandra
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Craving Premium Food? <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-500 bg-clip-text text-transparent">
              Delivered Hot & Fresh.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-(--text-secondary) max-w-2xl mx-auto">
            Discover curated culinary hotspots, exclusive discounts, and artisan dishes prepared by top chefs around your neighborhood.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-2xl shadow-orange-500/10 rounded-2xl overflow-hidden bg-(--bg-surface) border-2 border-orange-500/30 focus-within:border-orange-500 transition duration-300">
              <Search className="absolute left-4 text-orange-500" size={22} />
              <input
                type="text"
                placeholder="Search for restaurants, burgers, biryani, pizza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-transparent outline-none text-base sm:text-lg text-(--text-primary) placeholder-(--text-muted)"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mr-3 px-3 py-1 text-xs font-bold rounded-lg bg-(--bg-secondary) hover:bg-orange-500 hover:text-white transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Cuisine Categories */}
          <div className="pt-6 flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {cuisines.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCuisine(c.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition duration-200 shrink-0 ${
                  selectedCuisine === c.name
                    ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                    : "bg-(--bg-surface) border border-(--border-color) text-(--text-secondary) hover:border-orange-500/50"
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RESTAURANT DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--border-color) pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <Flame className="text-orange-500" />
              {selectedCuisine === "All" ? "Top Restaurants in Your Area" : `${selectedCuisine} Spots Near You`}
            </h2>
            <p className="text-sm text-(--text-muted) mt-1">
              {restaurants.length} {restaurants.length === 1 ? "restaurant" : "restaurants"} available right now
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: "All", label: "All Spots" },
              { id: "TopRated", label: "⭐ 4.5+ Rating" },
              { id: "PureVeg", label: "🌱 Pure Veg" },
              { id: "Fastest", label: "⚡ Fastest Delivery" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition duration-200 ${
                  activeFilter === f.id
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-(--bg-surface) border border-(--border-color) text-(--text-secondary) hover:border-orange-500/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-(--bg-surface) rounded-3xl border border-(--border-color) h-80"></div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 bg-(--bg-surface) rounded-3xl border border-(--border-color) p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto text-3xl">
              🔍
            </div>
            <h3 className="text-xl font-bold">No restaurants found matching your criteria</h3>
            <p className="text-(--text-muted) max-w-md mx-auto text-sm">
              Try adjusting your filters or search terms to explore other delicious options nearby.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("All");
                setSelectedCuisine("All");
              }}
              className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-600/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((resItem) => (
              <Link
                key={resItem._id}
                to={`/restaurant/${resItem._id}`}
                className="group bg-(--bg-surface) rounded-3xl border border-(--border-color) overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={resItem.image}
                      alt={resItem.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    {/* Offers Pill */}
                    {resItem.offers && resItem.offers.length > 0 && (
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-md">
                        {resItem.offers[0]}
                      </div>
                    )}

                    {/* Veg Badge */}
                    {resItem.isPureVeg && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-green-600 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                        <Leaf size={12} /> Pure Veg
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-orange-500 transition line-clamp-1">
                        {resItem.name}
                      </h3>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-700 text-white font-bold text-xs shrink-0 shadow-sm">
                        <span>{resItem.rating}</span>
                        <Star size={11} className="fill-white" />
                      </div>
                    </div>

                    <p className="text-xs text-(--text-muted) font-medium truncate">
                      {resItem.cuisines?.join(" • ")}
                    </p>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="px-5 py-3.5 bg-(--bg-secondary)/50 border-t border-(--border-color) flex items-center justify-between text-xs font-semibold text-(--text-secondary)">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-orange-500" />
                    {resItem.deliveryTime}
                  </span>
                  <span>₹{resItem.costForTwo} for two</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* WHY CRAVINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              The Cravings Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Unmatched Quality. Zero Compromises.
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Every order placed on Cravings goes through strict hygiene protocols, insulated thermal packaging, and real-time GPS tracking so your meal tastes exactly as the chef intended.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-orange-600 font-bold text-sm shadow-xl hover:bg-orange-50 transition active:scale-95"
              >
                Join Cravings Today <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
