"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ShoppingCart, Package, Boxes } from "lucide-react";

import { useStockProductos } from "@/hooks/useStock";
import { UMBRAL_STOCK_BAJO } from "@/constants/stock";

export default function QuickActions() {
  const { data: productos = [] } = useStockProductos();

  // Conteo consolidado: bajo stock + sin stock, con datos reales del backend
  const { bajoStock, sinStock } = useMemo(() => {
    let bajo = 0;
    let sin = 0;

    for (const p of productos) {
      if (p.cantidad === 0) {
        sin += 1;
      } else if (p.cantidad <= UMBRAL_STOCK_BAJO) {
        bajo += 1;
      }
    }

    return { bajoStock: bajo, sinStock: sin };
  }, [productos]);

  const totalAlertas = bajoStock + sinStock;
  const hayAlertas = totalAlertas > 0;

  const actions = [
    {
      title: "Nueva Venta",
      description: "Registrar una nueva venta",
      icon: ShoppingCart,
      href: "/ventas",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      badge: null as number | null,
      badgeLabel: null as string | null,
    },
    {
      title: "Nuevo Producto",
      description: "Agregar producto al catálogo",
      icon: Package,
      href: "/productos",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      badge: null as number | null,
      badgeLabel: null as string | null,
    },
    {
      title: "Ajustar Stock",
      description: hayAlertas
        ? `${bajoStock} con bajo stock · ${sinStock} sin stock`
        : "Inventario en buen estado",
      icon: Boxes,
      href: "/stock",
      iconBg: hayAlertas ? "bg-red-100" : "bg-yellow-100",
      iconColor: hayAlertas ? "text-red-600" : "text-yellow-600",
      badge: hayAlertas ? totalAlertas : null,
      badgeLabel: hayAlertas
        ? `${totalAlertas} producto${totalAlertas !== 1 ? "s" : ""} requieren atención`
        : null,
    },
  ];

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Acciones rápidas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="
                group bg-white rounded-2xl border border-slate-200 p-6
                shadow-sm hover:shadow-lg hover:-translate-y-1
                transition-all duration-200
              "
            >
              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                  <Icon size={28} className={action.iconColor} />
                </div>

                {action.badge !== null && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full leading-none">
                    {action.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">{action.title}</h3>

              <p className={`mt-2 text-sm ${action.badge !== null ? "text-red-500 font-medium" : "text-slate-500"}`}>
                {action.description}
              </p>

              <div className="mt-4 text-sm font-medium text-slate-700 group-hover:text-blue-600">
                Acceder
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}