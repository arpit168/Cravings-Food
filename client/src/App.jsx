import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useThemeStore from "./stores/useThemeStore";

// Components & Pages
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/dashboards/UserDashboard";
import RestaurantDetails from "./pages/RestaurantDetails";
import CartCheckout from "./pages/CartCheckout";
import OrderTracking from "./pages/OrderTracking";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ErrorPage from "./pages/Error";

// Multi-Role Dashboards
import OwnerDashboard from "./pages/dashboards/OwnerDashboard";
import PartnerDashboard from "./pages/dashboards/PartnerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

const App = () => {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-300 font-sans">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              borderRadius: "1rem",
              fontWeight: 600,
            },
          }}
        />

        <Header />

        <main className="flex-1">
          <Routes>
            {/* Core Customer Flow */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/checkout" element={<CartCheckout />} />
            <Route path="/order-tracking/:id" element={<OrderTracking />} />

            {/* Static & Explore Pages */}
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboards */}
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* 404 Error Page */}
            <Route path="/404" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
