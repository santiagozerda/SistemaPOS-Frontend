"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminMenuItems, cajeroMenuItems } from "../../constants/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems =
    user.role === "ADMINISTRADOR" ? adminMenuItems : cajeroMenuItems;

  // Match más específico primero, para que rutas anidadas (ej.
  // "/ventas/historial") no dejen también marcado como activo un
  // item padre más corto (ej. "/ventas").
  const activeHref = menuItems
    .filter(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside
      className="
        w-72
        bg-slate-950
        text-white
        border-r
        border-slate-800
        shadow-xl
      "
    >
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold">Panel de Control</h2>

        <p className="text-slate-400 text-sm mt-1">
          {user.role === "ADMINISTRADOR" ? "Administrador" : "Cajero"}
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active = item.href === activeHref;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition-all
                ${
                  active
                    ? "bg-slate-800 border border-slate-700"
                    : "hover:bg-slate-900"
                }
              `}
            >
              <Icon size={20} className={item.color} />

              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
