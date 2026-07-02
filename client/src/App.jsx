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

// Route Security Guards
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AuthRedirectRoute from "./components/AuthRedirectRoute";

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
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CartCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-tracking/:id"
              element={
                <ProtectedRoute>
                  <OrderTracking />
                </ProtectedRoute>
              }
            />

            {/* Static & Explore Pages */}
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Authentication (Redirect away if already logged in) */}
            <Route
              path="/login"
              element={
                <AuthRedirectRoute>
                  <Login />
                </AuthRedirectRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirectRoute>
                  <Register />
                </AuthRedirectRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthRedirectRoute>
                  <ForgotPassword />
                </AuthRedirectRoute>
              }
            />

            {/* Role-Protected Dashboards */}
            <Route
              path="/userDashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner-dashboard"
              element={
                <RoleRoute allowedRoles={["restaurant_owner", "admin"]}>
                  <OwnerDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/partner-dashboard"
              element={
                <RoleRoute allowedRoles={["delivery_partner", "admin"]}>
                  <PartnerDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />

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
