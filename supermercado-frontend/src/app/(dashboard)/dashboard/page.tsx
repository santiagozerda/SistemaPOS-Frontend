"use client";

import { Boxes, DollarSign, Package } from "lucide-react";

import KpiCard from "@/components/dashboard/KPICard";
import QuickActions from "@/components/dashboard/QuickActions";

import { useAuth } from "@/hooks/useAuth";
import { useStockProductos } from "@/hooks/useStock";
import { useReporteDia } from "@/hooks/useReportes";
import { UMBRAL_STOCK_BAJO } from "@/constants/stock";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user.role === "ADMINISTRADOR";

  const { data: productos = [] } = useStockProductos();
  const { data: reporteDia } = useReporteDia(isAdmin);

  const currentDate = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalProductos = productos.length;

  const productosConAlerta = productos.filter(
    (p) => p.cantidad <= UMBRAL_STOCK_BAJO
  ).length;

  const ventasHoy = reporteDia
    ? `$${reporteDia.resumen.totalVendido.toLocaleString("es-AR")}`
    : "-";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Panel Inicial</p>
        </div>
        <span className="text-sm text-slate-500 capitalize">{currentDate}</span>
      </div>

      {isAdmin && (
        <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <KpiCard
            title="Ventas de Hoy"
            value={ventasHoy}
            icon={DollarSign}
            href="/reportes"
          />
          <KpiCard
            title="Producto"
            value={String(totalProductos)}
            icon={Package}
            href="/productos"
          />
          <KpiCard
            title="Stock bajo"
            value={String(productosConAlerta)}
            icon={Boxes}
            href="/stock"
          />
        </section>
      )}

      {!isAdmin && <QuickActions />}
    </div>
  );
}