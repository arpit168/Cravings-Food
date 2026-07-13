import React, { useState, useEffect, useContext } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("CravingUser");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isLogin, setIsLogin] = useState(!!user);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const clearAuthState = () => {
    setUser(null);
    setIsLogin(false);
    sessionStorage.removeItem("CravingUser");
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
      } catch (error) {
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

  const updateUserState = (newUserData) => {
    setUser(newUserData);
    setIsLogin(!!newUserData);
    if (newUserData) {
      sessionStorage.setItem("CravingUser", JSON.stringify(newUserData));
    } else {
      sessionStorage.removeItem("CravingUser");
    }
  };

  const value = { user, setUser: updateUserState, isLogin, setIsLogin, loadingAuth, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};