import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const { setUser, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validateError, setValidateError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setValidateError({});
  };

  const validate = () => {
    let error = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      error.email = "Please enter a valid email address.";
    }
    if (!formData.password || formData.password.length < 5) {
      error.password = "Password must be at least 5 characters.";
    }
    setValidateError(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in required fields correctly");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message || "Login successful!");
      setUser(res.data.data);
      setIsLogin(true);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      handleClearForm();
      navigate("/userDashboard");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background transition-colors duration-300">
      <div className="max-w-md w-full bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Welcome Back
          </span>
          <h1 className="text-3xl font-black text-text-primary">Sign in to Cravings</h1>
          <p className="text-sm text-text-secondary">
            Enter your email and password to access your gourmet dashboard.
          </p>
        </div>

        <form onReset={handleClearForm} onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase text-text-muted">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              <input
                id="email"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="customer@cravings.com"
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition disabled:opacity-50"
              />
            </div>
            {validateError.email && (
              <p className="text-xs font-semibold text-danger">{validateError.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold uppercase text-text-muted">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-hover transition">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              <input
                id="password"
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition disabled:opacity-50"
              />
            </div>
            {validateError.password && (
              <p className="text-xs font-semibold text-danger">{validateError.password}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background"
            />
            <label htmlFor="remember" className="text-xs font-semibold text-text-secondary cursor-pointer">
              Keep me signed in for 7 days
            </label>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              disabled={isLoading}
              type="reset"
              className="w-1/3 py-3.5 bg-muted text-text-secondary font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-border transition cursor-pointer disabled:opacity-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover transition shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"} <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-border text-center text-xs text-text-secondary">
          Don't have an account yet?{" "}
          <Link to="/register" className="font-bold text-primary hover:text-primary-hover transition">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
