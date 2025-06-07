import { createContext, useContext, useEffect, useState } from "react";
import type { User, ApiResponse, AuthContextType } from "../lib/types";
import { message } from "antd";
import { requestHandler } from "../lib/requestHandler";

// Add these types for return values
type AuthResult = {
  success: boolean;
  error?: string;
  data?: any;
};

// Update AuthContextType to reflect new return types
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  refreshUser: async () => ({ success: false }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUser = async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      const data: ApiResponse<User> = await requestHandler({
        method: "GET",
        endpoint: "/api/auth/me",
      });

      if (data.success && data.data) {
        setUser(data.data);
        setError(null);
        return { success: true, data: data.data };
      } else {
        setUser(null);
        const errorMsg = data.message || "Failed to get user";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      console.error("Auth error:", errorMessage);
      setError(errorMessage);
      setUser(null);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async (): Promise<AuthResult> => {
    return getUser();
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const data: ApiResponse<User> = await requestHandler({
        method: "POST",
        endpoint: "/api/auth/register",
        data: { name, email, password },
      });

      if (data.success) {
        setError(null);
        return { success: true, data: data.data };
      } else {
        const errorMsg = data.message || "Registration failed";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      setError(errorMessage);
      // Remove the Ant Design message here since you'll handle it in component
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const data: ApiResponse<{ token: string }> = await requestHandler({
        method: "POST",
        endpoint: "/api/auth/login",
        data: { email, password },
      });

      console.log("json", JSON.stringify(data));

      if (data.success) {
        const userResult = await getUser();
        if (userResult.success) {
          return { success: true, data: data.data };
        } else {
          return {
            success: false,
            error: "Login successful but failed to get user data",
          };
        }
      } else {
        const errorMsg = data.message || "Login failed";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      console.log("got an error in the catch block");
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);
      console.error(errorMessage);
      // Remove the Ant Design message here since you'll handle it in component
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<AuthResult> => {
    try {
      const data: ApiResponse<{}> = await requestHandler({
        method: "POST",
        endpoint: "/api/auth/logout",
      });

      console.log(data)

      setUser(null);
      setError(null);
      message.success("Logged out successfully!");
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Logout failed";
      console.error("Logout error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
      }}
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
