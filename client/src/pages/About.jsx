import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-200 text-[#2E2A24]">
      
      {/* Hero Section */}
      <section className="px-6 md:px-20 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About <span className="text-[#D97706]">Cravings</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-(--color-accent)">
          We serve more than food — we serve experiences crafted with passion,
          freshness, and love for authentic flavors.
        </p>
      </section>

      {/* Content Section */}
      <section className="px-6 md:px-20 py-16 grid md:grid-cols-3 gap-8">
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-3 text-[#D97706]">
            Fresh Ingredients
          </h3>
          <p className="text-[#5C554B]">
            We use locally sourced, fresh ingredients to make every dish
            flavorful and healthy.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-3 text-[#D97706]">
            Expert Chefs
          </h3>
          <p className="text-[#5C554B]">
            Our chefs bring years of experience and creativity to your plate.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-3 text-[#D97706]">
            Fast & Hygienic
          </h3>
          <p className="text-[#5C554B]">
            From kitchen to doorstep, we maintain strict hygiene and speed.
          </p>
        </div>

      </section>

      {/* Footer CTA */}
      <section className="px-6 md:px-20 py-14 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Crafted with ❤️ for Food Lovers
        </h2>
        <p className="text-[#5C554B] mb-6">
          Join thousands who trust us for their daily cravings.
        </p>
        <button className="px-6 py-3 bg-[#D97706] text-white rounded-xl hover:bg-[#B45309] transition">
          Explore Menu
        </button>
      </section>

    </div>
  );
};

export default About;
