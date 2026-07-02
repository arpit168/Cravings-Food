import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Flame, Heart, Award, ArrowRight } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-background transition-colors duration-300">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
          Our Culinary Journey
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-text-primary">
          Redefining Food Delivery with Passion & Precision.
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
          Founded in 2026, Cravings connects food connoisseurs with elite local chefs, artisanal bakeries, and authentic kitchens through ultra-fast logistics and zero temperature loss packaging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface p-8 rounded-3xl border border-border space-y-3 shadow-xs text-center hover:border-primary/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
            🔥
          </div>
          <h3 className="font-bold text-lg text-text-primary">Curated Excellence</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Every partner restaurant is vetted by culinary experts for hygiene, authentic ingredients, and flavor consistency.
          </p>
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-border space-y-3 shadow-xs text-center hover:border-primary/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-info/10 text-info flex items-center justify-center mx-auto text-xl font-bold">
            ⚡
          </div>
          <h3 className="font-bold text-lg text-text-primary">Thermal GPS Tracking</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Our riders use insulated thermal chambers and AI routing algorithms to deliver food crisp and steaming hot.
          </p>
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-border space-y-3 shadow-xs text-center hover:border-primary/50 transition">
          <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mx-auto text-xl font-bold">
            🌱
          </div>
          <h3 className="font-bold text-lg text-text-primary">Eco-Conscious Packaging</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            100% biodegradable and reusable food storage boxes designed to protect both your health and our planet.
          </p>
        </div>
      </div>

      <div className="bg-primary rounded-3xl p-10 text-white text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-black">Ready to taste the Cravings difference?</h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-primary font-black text-sm shadow-xl hover:bg-muted transition"
        >
          Explore Restaurants <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
