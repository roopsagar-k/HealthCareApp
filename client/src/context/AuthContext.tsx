import { createContext, useContext, useEffect, useState } from "react";
import type { User, ApiResponse, AuthContextType } from "../lib/types";
import { message } from "antd";
import { requestHandler } from "../lib/requestHandler"; 

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUser = async () => {
    setLoading(true);
    try {
      const data: ApiResponse<User> = await requestHandler({
        method: "GET",
        endpoint: "/api/auth/me",
      });

      if (data.success && data.data) {
        setUser(data.data);
        setError(null);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error("Auth error:", error.message);
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    return getUser();
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data: ApiResponse<User> = await requestHandler({
        method: "POST",
        endpoint: "/api/auth/register",
        data: { name, email, password },
      });

      if (data.success) {
        message.success("Registration successful! Please login.");
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data: ApiResponse<{ token: string }> = await requestHandler({
        method: "POST",
        endpoint: "/api/auth/login",
        data: { email, password },
      });

      if (data.success) {
        message.success("Login successful!");
        await getUser();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await requestHandler({
        method: "POST",
        endpoint: "/api/auth/logout",
      });
      setUser(null);
      message.success("Logged out successfully!");
    } catch (error: any) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
