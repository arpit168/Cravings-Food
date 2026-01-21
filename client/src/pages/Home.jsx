import React from "react";
import img from "../assets/fastfood.jpg"

const Home = () => {
  return (
    <div className="bg-white text-slate-800">
      {/* HERO SECTION */}
      <section className="max-w-7xl md:mx-auto px-6  md:py-20 py-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-emerald-50 text-emerald-600">
            Premium Food Experience
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Delicious food,
            <br />
            <span className="text-slate-900">delivered with care</span>
          </h1>

          <p className="text-slate-500 text-lg mb-8 max-w-xl">
            Discover carefully crafted meals made with fresh ingredients,
            designed to bring restaurant-quality food straight to your home.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition">
              Order Now
            </button>
            <button className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:border-slate-400 transition">
              View Menu
            </button>
          </div>
        </div>

        {/* HERO IMAGE PLACEHOLDER */}
        <div className="relative">
          <img src={img} className=" rounded-3xl shadow-2xl" alt="" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Fresh Ingredients"
            desc="We source only high-quality, fresh ingredients from trusted suppliers."
          />
          <FeatureCard
            title="Fast Delivery"
            desc="Hot meals delivered quickly so you never compromise on taste."
          />
          <FeatureCard
            title="Premium Quality"
            desc="Restaurant-grade quality with consistent flavor every time."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Experience food the premium way
        </h2>
        <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
          Join thousands of happy customers enjoying thoughtfully prepared
          meals, delivered with care.
        </p>

        <button className="px-8 py-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

/* Feature Card Component */
const FeatureCard = ({ title, desc }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
);

export default Home;
