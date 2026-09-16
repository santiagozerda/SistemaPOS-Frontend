import {
  Home,
  Package,
  ShoppingCart,
  Boxes,
  BarChart3,
  BadgePercent,
  Building2,
  History,
  LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

// ─── Menú para el rol CAJERO ───────────────────────────────────────────────
export const cajeroMenuItems: NavigationItem[] = [
  {
    label: "Inicio",
    href: "/dashboard",
    icon: Home,
    color: "text-blue-500",
  },
  {
    label: "Productos",
    href: "/productos",
    icon: Package,
    color: "text-emerald-500",
  },
  {
    label: "Ventas",
    href: "/ventas",
    icon: ShoppingCart,
    color: "text-orange-500",
  },
  {
    label:"Historial Ventas",
    href: "/ventas/historial",
    icon: History,
    color: "text-indigo-500",
  }
  // CR-01: "Stock" removido del menú de Cajero — su contenido
  // ahora se visualiza embebido dentro de "Productos".
];

// ─── Menú para el rol ADMINISTRADOR ───────────────────────────────────────
export const adminMenuItems: NavigationItem[] = [
  {
    label: "Inicio",
    href: "/dashboard",
    icon: Home,
    color: "text-blue-500",
  },
  {
    label: "Ventas",
    href: "/ventas",
    icon: ShoppingCart,
    color: "text-orange-500",
  },
  {
    label: "Productos",
    href: "/productos",
    icon: Package,
    color: "text-emerald-500",
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: BarChart3,
    color: "text-purple-500",
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Boxes,
    color: "text-yellow-500",
  },
  {
    label: "Promociones",
    href: "/configuracion/promociones",
    icon: BadgePercent,
    color: "text-pink-500",
  },
  {
    label: "Sucursal",
    href: "/configuracion/sucursales",
    icon: Building2,
    color: "text-cyan-500",
  },
];

// Alias para compatibilidad con imports existentes
export const menuItems = cajeroMenuItems;