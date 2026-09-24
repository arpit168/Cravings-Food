"use client";

import React, { useState, useEffect, useContext, ReactNode } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  loadingAuth: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("CravingUser");
        return saved ? JSON.parse(saved) : null;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    return null;
  });
  const [isLogin, setIsLogin] = useState<boolean>(!!user);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  const clearAuthState = () => {
    setUser(null);
    setIsLogin(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("CravingUser");
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data && res.data.data) {
          const nextUser = res.data.data;
          setUser(nextUser);
          setIsLogin(true);
          sessionStorage.setItem("CravingUser", JSON.stringify(nextUser));
        } else {
          clearAuthState();
        }
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error("Auth verification failed", error);
        }
        clearAuthState();
      } finally {
        setLoadingAuth(false);
      }
    };

    verifyAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
    } finally {
      clearAuthState();
    }
  };

  const updateUserState = (newUserData: User | null) => {
    setUser(newUserData);
    setIsLogin(!!newUserData);
    if (typeof window !== "undefined") {
      if (newUserData) {
        sessionStorage.setItem("CravingUser", JSON.stringify(newUserData));
      } else {
        sessionStorage.removeItem("CravingUser");
      }
    }
  };

  const value: AuthContextType = {
    user,
    setUser: updateUserState,
    isLogin,
    setIsLogin,
    loadingAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
