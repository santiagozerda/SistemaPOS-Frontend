"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { AuthProvider } from "@/context/AuthContext";
import { AuthUser } from "@/types/auth";
import { getCurrentUser } from "@/services/auth-service";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const [sessionUser, setSessionUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCurrentUser().then((user) => {
      if (cancelled) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      setSessionUser(user);
      setChecking(false);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking || !sessionUser) return null;

  return (
    <AuthProvider initialUser={sessionUser}>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}