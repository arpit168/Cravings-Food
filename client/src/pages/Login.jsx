import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, ShieldCheck } from "lucide-react";

const Login = () => {
  const { setUser, setIsLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validateError, setValidateError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (validateError[name]) {
      setValidateError(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);
  };

  const handleClearForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setValidateError({});
    setTouchedFields({});
    setRememberMe(false);
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
      toast.error("Please fix all validation errors");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message || "Welcome back! 🎉");
      setUser(res.data.data);
      setIsLogin(true);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      if (rememberMe) {
        localStorage.setItem("rememberEmail", formData.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }
      handleClearForm();
      navigate("/userDashboard");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const base = "w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 rounded-2xl text-text-primary text-sm transition-all duration-300 placeholder:text-text-muted/60";
    const focus = focusedField === fieldName ? "border-primary shadow-lg shadow-primary/10 scale-[1.01]" : "border-border/50 hover:border-primary/30";
    const error = validateError[fieldName] && touchedFields[fieldName] ? "border-danger shadow-lg shadow-danger/10" : "";
    return `${base} ${focus} ${error}`;
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-md w-full relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        </div>

        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-4xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-primary/5 transition-all duration-300">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Welcome Back
              </span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Sign In
            </h1>
            <p className="text-text-secondary text-sm max-w-xs mx-auto">
              Welcome back! Please enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60" size={18} />
                <input
                  id="email"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => handleBlur("email")}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  className={getInputClassName("email")}
                />
              </div>
              {validateError.email && touchedFields.email && (
                <p className="text-xs text-danger animate-slideDown">
                  {validateError.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-primary hover:text-primary-hover transition-all hover:underline underline-offset-4"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60" size={18} />
                <input
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => handleBlur("password")}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className={getInputClassName("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {validateError.password && touchedFields.password && (
                <p className="text-xs text-danger animate-slideDown">
                  {validateError.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-2 border-border/60 text-primary focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                  Remember me
                </span>
              </label>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <ShieldCheck className="w-3 h-3" />
                <span>Secure login</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={handleClearForm}
                disabled={isLoading}
                className="w-1/3 py-3.5 bg-gray-100 dark:bg-gray-800 text-text-secondary font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 bg-gradient-to-r from-primary to-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/80 dark:bg-gray-900/80 text-text-muted backdrop-blur-sm">
                New to Cravings?
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl font-bold text-sm text-primary hover:from-primary/20 hover:to-primary/10 transition-all duration-300 group"
            >
              Create New Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-xs text-text-muted mt-4">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="hover:text-primary transition-colors underline underline-offset-2">
                Terms
              </Link>{" "}
              &{" "}
              <Link to="/privacy" className="hover:text-primary transition-colors underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;