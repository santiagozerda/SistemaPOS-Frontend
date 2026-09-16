"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthUser } from "@/types/auth";
import { logoutRequest } from "@/services/auth-service";

interface AuthContextType {
  user: AuthUser;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: AuthUser;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const router = useRouter();
  const [user] = useState<AuthUser>(initialUser);

  const logout = async () => {
    await logoutRequest();
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }
  return context;
}