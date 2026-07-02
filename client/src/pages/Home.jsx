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
    <div className="min-h-screen pb-20 bg-background transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold text-xs uppercase tracking-wider animate-bounce">
            <Sparkles size={14} /> Lightning Fast 20-Min Delivery in Bandra
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-text-primary">
            Craving Premium Food? <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Delivered Hot & Fresh.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-text-secondary text-base sm:text-lg font-medium leading-relaxed">
            Order from Bandra’s top-rated kitchens, iconic bakeries, and gourmet cloud kitchens. Real-time GPS tracking and thermal packaging guaranteed.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden bg-surface border-2 border-primary/30 focus-within:border-primary transition duration-300">
              <Search className="absolute left-5 text-primary" size={22} />
              <input
                type="text"
                placeholder="Search for burgers, authentic biryani, pizza or restaurant name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-32 py-4 bg-transparent text-text-primary placeholder:text-text-muted outline-none font-semibold text-sm sm:text-base"
              />
              <button
                onClick={fetchRestaurants}
                className="absolute right-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CUISINE CAROUSEL / PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Flame className="text-primary fill-primary" size={20} /> What's on your mind?
          </h2>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-hide">
          {cuisines.map((item) => {
            const isSelected = selectedCuisine === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setSelectedCuisine(item.name)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer shadow-xs ${
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                    : "bg-surface border border-border text-text-secondary hover:border-primary/50 hover:text-primary"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* QUICK FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter size={14} /> Quick Filters:
          </span>

          {[
            { id: "All", label: "All Restaurants" },
            { id: "TopRated", label: "⭐ Rating 4.5+" },
            { id: "Fastest", label: "⚡ Fastest Delivery" },
            { id: "PureVeg", label: "🌱 Pure Veg Only" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === f.id
                  ? "bg-secondary text-white shadow-md"
                  : "bg-surface border border-border text-text-secondary hover:border-primary/50 hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-text-muted">
          Showing <strong className="text-text-primary">{restaurants.length}</strong> partner kitchens
        </span>
      </section>

      {/* RESTAURANT DIRECTORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-surface rounded-3xl border border-border h-80"></div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-border p-8 space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              🍽️
            </div>
            <h3 className="text-xl font-bold text-text-primary">No restaurants found matching criteria</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Try resetting your search query or switching cuisine categories to view available kitchens.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCuisine("All");
                setActiveFilter("All");
              }}
              className="px-6 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((resItem) => (
              <Link
                key={resItem._id}
                to={`/restaurant/${resItem._id}`}
                className="group bg-surface rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Image Banner */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={resItem.image}
                      alt={resItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <div className="text-white space-y-1">
                        <span className="font-black text-lg tracking-tight drop-shadow-md flex items-center gap-1.5">
                          ₹{resItem.costForTwo} for two
                        </span>
                      </div>
                    </div>

                    {resItem.isFeatured && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-white font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                        <TrendingUp size={12} /> Bestseller
                      </span>
                    )}

                    {resItem.isPureVeg && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-success text-white font-bold text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Leaf size={10} /> Pure Veg
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition truncate">
                        {resItem.name}
                      </h3>
                      <span className="px-2 py-1 rounded-lg bg-success text-white text-xs font-black flex items-center gap-1 shrink-0 shadow-xs">
                        {resItem.rating} <Star size={10} className="fill-white" />
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-text-muted truncate">
                      {resItem.cuisines?.join(" • ") || "North Indian • Biryani"}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 bg-muted/60 border-t border-border flex items-center justify-between text-xs font-bold text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" /> {resItem.deliveryTime || 25} mins
                  </span>
                  <span className="text-primary group-hover:translate-x-1 transition flex items-center gap-1">
                    Order Now <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
