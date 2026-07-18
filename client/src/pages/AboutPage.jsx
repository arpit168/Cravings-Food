import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Flame, 
  Heart, 
  Award, 
  ArrowRight,
  Clock,
  Truck,
  Leaf,
  Star,
  Users,
  ChefHat
} from "lucide-react";

const AboutPage = () => {
  const stats = [
    { value: "500+", label: "Partner Restaurants" },
    { value: "50K+", label: "Happy Customers" },
    { value: "15 min", label: "Average Delivery" },
    { value: "99.9%", label: "On-Time Rate" },
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Curated Excellence",
      description: "Every partner restaurant is vetted by culinary experts for hygiene, authentic ingredients, and flavor consistency.",
      color: "primary"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Thermal GPS Tracking",
      description: "Our riders use insulated thermal chambers and AI routing algorithms to deliver food crisp and steaming hot.",
      color: "info"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Eco-Conscious Packaging",
      description: "100% biodegradable and reusable food storage boxes designed to protect both your health and our planet.",
      color: "success"
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Expert Chefs Network",
      description: "Work with Michelin-trained chefs and local culinary artisans who bring global flavors to your doorstep.",
      color: "warning"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-Time Updates",
      description: "Track your order from kitchen to doorstep with live GPS updates and estimated delivery times.",
      color: "info"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community First",
      description: "We support local communities by partnering with small businesses and offering fair commission rates.",
      color: "danger"
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Food Blogger",
      content: "Cravings has completely transformed how I experience food delivery. The quality is consistently exceptional!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Restaurant Owner",
      content: "Partnering with Cravings was the best decision for our business. They truly care about quality and community.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Regular Customer",
      content: "The thermal packaging is a game-changer. My food always arrives hot and fresh, just like dining in!",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Award className="w-4 h-4" />
              <span>Est. 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-text-primary leading-tight">
              Redefining Food Delivery with{" "}
              <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Passion & Precision
              </span>
            </h1>
            
            <p className="text-text-secondary text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              Founded in 2026, Cravings connects food connoisseurs with elite local chefs, 
              artisanal bakeries, and authentic kitchens through ultra-fast logistics and 
              zero temperature loss packaging.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Explore Restaurants <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-surface border border-border text-text-primary font-bold text-sm hover:bg-surface/80 transition-all duration-300"
              >
                Learn More <Flame size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-border py-12 bg-surface/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
            Delivering More Than Just Food
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We're passionate about creating exceptional food experiences from order to delivery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-surface p-8 rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 text-${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-surface/50 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
              What Our Community Says
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-surface p-8 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-text-primary text-sm leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-bold text-text-primary text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden bg-linear-to-br from-primary to-primary/80 rounded-3xl p-10 md:p-16 text-white text-center space-y-6">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black">
              Ready to Experience the Difference?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made Cravings their go-to food delivery platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Order Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Contact Us <Heart size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;