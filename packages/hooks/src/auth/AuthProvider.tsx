import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AlldareApi } from "@alldare/api";
import { Account } from "@alldare/types";

interface AuthContextType {
  user: Account | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  storage: {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: string) => Promise<void> | void;
    removeItem: (key: string) => Promise<void> | void;
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, storage }) => {
  const [user, setUser] = useState<Account | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = await storage.getItem("auth_token");
        if (savedToken) {
          setToken(savedToken);
          AlldareApi.init({
            baseUrl: "http://localhost:80", // Should come from config
            getToken: () => savedToken,
          });
          const account = await AlldareApi.me();
          setUser(account);
        }
      } catch (e) {
        console.error("Auth init failed", e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (newToken: string) => {
    await storage.setItem("auth_token", newToken);
    setToken(newToken);
    AlldareApi.init({
      baseUrl: "http://localhost:80",
      getToken: () => newToken,
    });
    const account = await AlldareApi.me();
    setUser(account);
  };

  const logout = async () => {
    await storage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
