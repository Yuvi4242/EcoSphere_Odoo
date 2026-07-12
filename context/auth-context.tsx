"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession, AuthState } from "@/types/auth";
import api from "@/services/api";

interface AuthContextType extends AuthState {
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  setUserSession: (user: UserSession) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await api.get("/auth/me");
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        // Clear invalid token if fetching identity fails
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = (token: string, userSession: UserSession) => {
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax; Secure`;
    setUser(userSession);
  };

  const logout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    window.location.href = "/login";
  };

  const setUserSession = (userSession: UserSession) => {
    setUser(userSession);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
