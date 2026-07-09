import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/Api";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Shield,
  Utensils,
  Bike
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});

  const roleFeatures = {
    customer: {
      icon: Utensils,
      label: "Customer",
      description: "Order from the best restaurants",
      gradient: "from-blue-500 to-cyan-400"
    },
    restaurant_owner: {
      icon: Sparkles,
      label: "Restaurant Partner",
      description: "List your kitchen & grow your business",
      gradient: "from-orange-500 to-amber-400"
    },
    delivery_partner: {
      icon: Bike,
      label: "Delivery Rider",
      description: "Earn with every delivery",
      gradient: "from-green-500 to-emerald-400"
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (validationError[name]) {
      setValidationError(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    setFocusedField(null);
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
      toast.error("Please fix all validation errors");
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

  const getInputClassName = (fieldName) => {
    const base = "w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 rounded-2xl text-text-primary text-sm transition-all duration-300 placeholder:text-text-muted/60";
    const focus = focusedField === fieldName ? "border-primary shadow-lg shadow-primary/10 scale-[1.01]" : "border-border/50 hover:border-primary/30";
    const error = validationError[fieldName] && touchedFields[fieldName] ? "border-danger shadow-lg shadow-danger/10" : "";
    return `${base} ${focus} ${error}`;
  };

  const CurrentRoleIcon = roleFeatures[formData.role].icon;

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-2xl w-full">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 sm:p-12 rounded-4xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-primary/5 transition-all duration-300">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Join Our Community
              </span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-text-secondary text-sm max-w-sm mx-auto">
              Start your culinary journey with us today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Phone - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="Rohan Sharma"
                  className={getInputClassName("fullName")}
                />
                {validationError.fullName && touchedFields.fullName && (
                  <p className="text-xs text-danger animate-slideDown">
                    {validationError.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  Mobile Number
                </label>
                <input
                  required
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("mobileNumber")}
                  onBlur={() => handleBlur("mobileNumber")}
                  placeholder="9876543210"
                  className={getInputClassName("mobileNumber")}
                />
                {validationError.mobileNumber && touchedFields.mobileNumber && (
                  <p className="text-xs text-danger animate-slideDown">
                    {validationError.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => handleBlur("email")}
                placeholder="rohan@example.com"
                className={getInputClassName("email")}
              />
              {validationError.email && touchedFields.email && (
                <p className="text-xs text-danger animate-slideDown">
                  {validationError.email}
                </p>
              )}
            </div>

            {/* Password & Confirm - Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => handleBlur("password")}
                    placeholder="Create a strong password"
                    className={getInputClassName("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {validationError.password && touchedFields.password && (
                  <p className="text-xs text-danger animate-slideDown">
                    {validationError.password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm Password
                </label>
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="Confirm your password"
                  className={getInputClassName("confirmPassword")}
                />
                {validationError.confirmPassword && touchedFields.confirmPassword && (
                  <p className="text-xs text-danger animate-slideDown">
                    {validationError.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Role Selection - Enhanced */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase text-text-muted tracking-wider flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                Select Your Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(roleFeatures).map(([value, { icon: Icon, label, description, gradient }]) => (
                  <label
                    key={value}
                    className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 ${
                      formData.role === value
                        ? `border-primary bg-gradient-to-br ${gradient}/10 shadow-lg shadow-primary/10 scale-[1.02]`
                        : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={formData.role === value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">{label}</p>
                        <p className="text-[10px] text-text-muted">{description}</p>
                      </div>
                    </div>
                    {formData.role === value && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-bold text-sm uppercase tracking-wider rounded-2xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:text-primary-hover transition-all hover:underline underline-offset-4"
              >
                Sign In Now
              </Link>
            </p>
            <p className="text-xs text-text-muted mt-3">
              By registering, you agree to our{" "}
              <Link to="/terms" className="hover:text-primary transition-colors underline underline-offset-2">
                Terms of Service
              </Link>{" "}
              and{" "}
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

export default Register;