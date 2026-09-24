
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Smartphone, Mail, Lock, Hand, ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function Login() {
  const { setUser, setIsLogin } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"phone" | "email">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
  });

  const [validateError, setValidateError] = useState<any>({});
  const [touchedFields, setTouchedFields] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validateError[name]) {
      setValidateError((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev: any) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    let errors: any = {};
    if (activeTab === "email") {
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
      }
      if (!formData.password || formData.password.length < 5) {
        errors.password = "Password must be at least 5 characters.";
      }
    } else {
      if (!formData.phone || formData.phone.length < 10) {
        errors.phone = "Please enter a valid phone number.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidateError(errors);
      setTouchedFields({ email: true, password: true, phone: true });
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === "email") {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        toast.success(res.data.message || "Welcome back! 🎉");
        const nextUser = res.data.data;
        setUser(nextUser);
        setIsLogin(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("CravingUser", JSON.stringify(nextUser));
        }
        
        if (nextUser.role === "admin") router.push("/admin/dashboard");
        else if (nextUser.role === "restaurant_owner") router.push("/restaurant/dashboard");
        else if (nextUser.role === "delivery_partner") router.push("/delivery/dashboard");
        else router.push("/customer/dashboard");
      } else {
        // Mock phone OTP flow since it's not fully standard in the standard login route
        toast.success("OTP Sent! (Mocking success)");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      
      {/* LEFT SIDE - Form */}
      <div className="w-full lg:w-[45%] flex flex-col px-6 sm:px-12 lg:px-20 py-8 overflow-y-auto relative z-10">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-gray-900 font-black text-sm tracking-tighter">
            CRV
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Cravings</span>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-orange-200 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6">
              <Hand className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-[1.75rem] font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Getting Started with Cravings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You can continue using your phone number or email address
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 relative">
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                activeTab === "phone"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4" />
                Phone Number
              </div>
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                activeTab === "email"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </div>
            </button>

            {/* Active Tab Indicator */}
            <div 
              className={`absolute bottom-0 h-0.5 bg-orange-500 transition-all duration-300 ease-in-out`}
              style={{ 
                width: "50%", 
                left: activeTab === "phone" ? "0%" : "50%" 
              }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {activeTab === "phone" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative flex rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                  <div className="flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <Smartphone className="w-4 h-4 mr-1.5" /> +91
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    className="flex-1 px-4 py-3 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                {validateError.phone && touchedFields.phone && (
                  <p className="text-xs text-red-500 mt-1">{validateError.phone}</p>
                )}
              </div>
            ) : (
              <div className="space-y-5">
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
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>
                  {validateError.email && touchedFields.email && (
                    <p className="text-xs text-red-500 mt-1">{validateError.email}</p>
                  )}
                </div>

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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {validateError.password && touchedFields.password && (
                    <p className="text-xs text-red-500 mt-1">{validateError.password}</p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading 
                ? "Processing..." 
                : (activeTab === "phone" ? "Get Verification Code" : "Sign In")
              }
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            {activeTab === "phone" ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link href="/register" className="text-orange-500 font-bold hover:underline">
              {activeTab === "phone" ? "Login" : "Sign Up"}
            </Link>
          </p>
        </div>

        {/* Footer Policy */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
            By continuing, you indicate that you have read and agreed to the{" "}
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
            Cravings<br/>Smart Food Delivery
          </h2>
          <p className="text-gray-700 dark:text-orange-200/80 text-sm leading-relaxed mb-12 max-w-md">
            Streamline your restaurant operations and reach more hungry customers with our intelligent POS and delivery orchestration network.
          </p>
          
          {/* Dashboard Image Mockup */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/20 transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-out border-8 border-white/40 dark:border-black/20 backdrop-blur-sm">
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
