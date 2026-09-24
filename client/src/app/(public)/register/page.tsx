
"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import {
  User,
  Mail,
  Smartphone,
  Lock,
  ArrowRight,
  CheckCircle2,
  Utensils,
  Sparkles,
  Bike,
  Eye,
  EyeOff
} from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<any>({});

  const roleFeatures: any = {
    customer: {
      icon: Utensils,
      label: "Customer",
      description: "Order food",
    },
    restaurant_owner: {
      icon: Sparkles,
      label: "Restaurant",
      description: "List kitchen",
    },
    delivery_partner: {
      icon: Bike,
      label: "Rider",
      description: "Earn delivery",
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError[name]) {
      setValidationError((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev: any) => ({ ...prev, [field]: true }));
  };

  const validate = () => {
    let error: any = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setTouchedFields({
        fullName: true, email: true, mobileNumber: true, password: true, confirmPassword: true
      });
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
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: string) => {
    const isError = validationError[fieldName] && touchedFields[fieldName];
    return `w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111] border ${
      isError 
        ? "border-red-500 focus:ring-red-500/20" 
        : "border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:ring-orange-500/10"
    } rounded-lg text-sm transition-colors focus:outline-none focus:ring-4`;
  };

  return (
    <div className="min-h-screen flex w-full bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* LEFT SIDE - Form */}
      <div className="w-full lg:w-[45%] flex flex-col px-6 sm:px-12 lg:px-20 py-8 overflow-y-auto relative z-10">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-gray-900 font-black text-sm tracking-tighter">
            CRV
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Cravings</span>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          
          {/* Header Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-[1.75rem] font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Create an Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Join us to order food or grow your business
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Rohan Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("fullName")}
                    className={getInputClassName("fullName")}
                  />
                </div>
                {validationError.fullName && touchedFields.fullName && (
                  <p className="text-xs text-red-500 mt-1">{validationError.fullName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="9876543210"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    onBlur={() => handleBlur("mobileNumber")}
                    className={getInputClassName("mobileNumber")}
                  />
                </div>
                {validationError.mobileNumber && touchedFields.mobileNumber && (
                  <p className="text-xs text-red-500 mt-1">{validationError.mobileNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={getInputClassName("email")}
                />
              </div>
              {validationError.email && touchedFields.email && (
                <p className="text-xs text-red-500 mt-1">{validationError.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    className={getInputClassName("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationError.password && touchedFields.password && (
                  <p className="text-xs text-red-500 mt-1">{validationError.password}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Confirm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CheckCircle2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={getInputClassName("confirmPassword")}
                  />
                </div>
                {validationError.confirmPassword && touchedFields.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{validationError.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                I want to join as a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(roleFeatures).map(([value, { icon: Icon, label }]: any) => (
                  <label
                    key={value}
                    className={`relative cursor-pointer rounded-xl border p-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                      formData.role === value
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm shadow-orange-500/10"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-600 dark:text-gray-400"
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
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                    {formData.role === value && (
                      <CheckCircle2 className="w-3 h-3 absolute top-1.5 right-1.5" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? "Processing..." : "Create Account"}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer Policy */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
            By registering, you agree to our{" "}
            <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Branding & Hero Image */}
      <div className="hidden lg:flex w-[55%] bg-gradient-to-br from-[#ffe8d6] to-[#ffccaa] dark:from-[#2a1309] dark:to-[#451e0e] p-16 flex-col justify-center relative overflow-hidden">
        
        <div className="max-w-xl mx-auto z-10 w-full">
          <h2 className="text-[2.5rem] font-bold text-gray-900 dark:text-orange-100 leading-tight mb-4">
            Start Your Journey<br/>with Cravings
          </h2>
          <p className="text-gray-700 dark:text-orange-200/80 text-sm leading-relaxed mb-12 max-w-md">
            Whether you want to discover amazing local food, list your kitchen, or deliver smiles—our platform makes it seamless.
          </p>
          
          {/* Dashboard Image Mockup */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/20 transform -rotate-1 hover:rotate-0 transition-transform duration-500 ease-out border-8 border-white/40 dark:border-black/20 backdrop-blur-sm">
            <Image 
              src="/dashboard-mockup.jpg"
              alt="Dashboard Interface"
              width={800}
              height={600}
              className="w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-300/30 dark:bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-200/40 dark:bg-orange-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      </div>
    </div>
  );
}
