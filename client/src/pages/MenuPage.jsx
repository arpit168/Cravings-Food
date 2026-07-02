import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../config/Api";
import { Search, Flame, Star } from "lucide-react";

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/restaurants");
      if (res.data && res.data.data) {
        setRestaurants(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisines?.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-background transition-colors duration-300">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-text-primary">Explore All Cravings Cuisines</h1>
        <p className="text-text-muted text-sm sm:text-base">
          Browse through hundreds of signature gourmet items crafted by top partner kitchens.
        </p>

        <div className="relative flex items-center bg-surface border border-border rounded-2xl overflow-hidden px-4 py-2 mt-4 shadow-md focus-within:border-primary transition">
          <Search className="text-primary mr-3" size={20} />
          <input
            type="text"
            placeholder="Search by restaurant name or cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-surface rounded-3xl border border-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((resItem) => (
            <Link
              key={resItem._id}
              to={`/restaurant/${resItem._id}`}
              className="bg-surface rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-xl hover:shadow-primary/10 transition group"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={resItem.image} alt={resItem.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition">{resItem.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-success text-white text-xs font-bold flex items-center gap-1">
                    {resItem.rating} <Star size={10} className="fill-white" />
                  </span>
                </div>
                <p className="text-xs text-text-muted">{resItem.cuisines?.join(" • ")}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
