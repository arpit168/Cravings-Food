import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/Api";
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let error = {};
    if (formData.fullName.length < 3) {
      error.fullName = "Name must be at least 3 characters";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      error.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    if (formData.password.length < 5) {
      error.password = "Password must be at least 5 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      error.confirmPassword = "Passwords do not match";
    }
    setValidationError(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please verify all fields before submitting");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        role: formData.role,
      };
      const res = await api.post("/auth/register", payload);
      toast.success(res.data.message || "Account registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background transition-colors duration-300">
      <div className="max-w-xl w-full bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            Join Our Platform
          </span>
          <h1 className="text-3xl font-black text-text-primary">Create Your Account</h1>
          <p className="text-sm text-text-secondary">
            You are one step away from exploring the finest culinary creations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-text-muted">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Rohan Sharma"
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
              {validationError.fullName && (
                <p className="text-xs text-danger">{validationError.fullName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-text-muted">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                <input
                  required
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
              {validationError.mobileNumber && (
                <p className="text-xs text-danger">{validationError.mobileNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-text-muted">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rohan@example.com"
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
            {validationError.email && (
              <p className="text-xs text-danger">{validationError.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-text-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
              {validationError.password && (
                <p className="text-xs text-danger">{validationError.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-text-muted">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-text-muted" size={18} />
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
              {validationError.confirmPassword && (
                <p className="text-xs text-danger">{validationError.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-bold uppercase text-text-muted">Account Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-primary transition font-semibold"
            >
              <option value="customer">Customer (Order Food)</option>
              <option value="restaurant_owner">Restaurant Partner (List Kitchen)</option>
              <option value="delivery_partner">Delivery Rider (Earn per Delivery)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-primary-hover transition shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Register Account"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center text-xs text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:text-primary-hover transition">
            Sign In Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
