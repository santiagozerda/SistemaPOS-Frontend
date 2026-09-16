"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { rolePermissions } from "@/config/permissions";

export default function ConfiguracionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const allowed = rolePermissions.configuration.includes(user.role);

  useEffect(() => {
    if (!allowed) {
      toast.error("No tienes permisos para acceder a esta sección");
      router.replace("/dashboard");
    }
  }, [allowed, router]);

  if (!allowed) return null;

  return <>{children}</>;
}