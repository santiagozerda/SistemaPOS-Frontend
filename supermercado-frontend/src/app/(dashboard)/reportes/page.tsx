"use client";

import { useState } from "react";
import { Award, DollarSign, Package, Receipt } from "lucide-react";

import ReportKpiCard from "@/components/reportes/ReportKpiCard";
import ReportTable from "@/components/reportes/ReportTable";
import ReportTabs, { ReportePeriodo } from "@/components/reportes/ReportTabs";
import MonthYearPicker from "@/components/reportes/MonthYearPicker";
import WeekPickerCalendar from "@/components/reportes/WeekPickerCalendar";

import {
  useProductosMasVendidos,
  useReporteDia,
  useReporteMes,
  useReporteSemana,
  useSemanasDelMes,
} from "@/hooks/useReportes";

import {
  ProductoMasVendidoDTO,
  VentaDiaDTO,
  VentaMesDTO,
  VentaSemanaDTO,
} from "@/types/reporte";

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const METODO_PAGO_LABEL: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

function formatearDiaCorto(iso: string) {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

export default function ReportesPage() {
  const hoy = new Date();

  const [tab, setTab] = useState<ReportePeriodo>("dia");
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<number | null>(
    null
  );

  const cambiarTab = (nuevoTab: ReportePeriodo) => {
    setTab(nuevoTab);
    setSemanaSeleccionada(null);
  };

  const cambiarPeriodo = (nuevoAnio: number, nuevoMes: number) => {
    setAnio(nuevoAnio);
    setMes(nuevoMes);
    setSemanaSeleccionada(null);
  };

  // Drill-down: click en una fila de la tabla Mes -> salta a la vista
  // Semana con esa semana ya seleccionada.
  const irASemana = (numeroSemana: number) => {
    setSemanaSeleccionada(numeroSemana);
    setTab("semana");
  };

  const reporteDia = useReporteDia(tab === "dia");
  const reporteMes = useReporteMes(anio, mes, tab === "mes");
  const semanasDelMes = useSemanasDelMes(anio, mes, tab === "semana");
  const reporteSemana = useReporteSemana(
    anio,
    mes,
    semanaSeleccionada,
    tab === "semana"
  );
  const productosMasVendidos = useProductosMasVendidos();

  const resumenActivo =
    tab === "dia"
      ? reporteDia.data?.resumen
      : tab === "semana"
        ? reporteSemana.data?.resumen
        : reporteMes.data?.resumen;

  const cargandoResumen =
    tab === "dia"
      ? reporteDia.isLoading
      : tab === "semana"
        ? semanaSeleccionada !== null && reporteSemana.isLoading
        : reporteMes.isLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-slate-500 mt-1">Resumen de ventas por período</p>
        </div>

        <ReportTabs active={tab} onChange={cambiarTab} />
      </div>

      {(tab === "semana" || tab === "mes") && (
        <MonthYearPicker anio={anio} mes={mes} onChange={cambiarPeriodo} />
      )}

      {tab === "semana" && (
        <WeekPickerCalendar
          anio={anio}
          mes={mes}
          semanas={semanasDelMes.data ?? []}
          semanaSeleccionada={semanaSeleccionada}
          onSelectSemana={setSemanaSeleccionada}
          isLoading={semanasDelMes.isLoading}
        />
      )}

      {/* KPIs del período activo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportKpiCard
          title="Total Vendido"
          value={
            cargandoResumen
              ? "…"
              : formatoMoneda.format(resumenActivo?.totalVendido ?? 0)
          }
          icon={DollarSign}
        />

        <ReportKpiCard
          title="Cantidad de Ventas"
          value={cargandoResumen ? "…" : String(resumenActivo?.cantidadVentas ?? 0)}
          icon={Receipt}
        />

        <ReportKpiCard
          title="Ticket Promedio"
          value={
            cargandoResumen
              ? "…"
              : formatoMoneda.format(resumenActivo?.promedioVenta ?? 0)
          }
          icon={Package}
        />
      </div>

      {/* Tabla según el período activo */}
      {tab === "dia" && (
        <ReportTable<VentaDiaDTO>
          columnas={[
            { header: "N° Ticket", render: (v) => v.numeroTicket },
            {
              header: "Método de Pago",
              render: (v) => METODO_PAGO_LABEL[v.metodoPago] ?? v.metodoPago,
            },
            {
              header: "Total",
              render: (v) => formatoMoneda.format(v.total),
              align: "right",
            },
          ]}
          filas={reporteDia.data?.tabla ?? []}
          keyExtractor={(v) => v.numeroTicket}
          emptyMessage="No hay ventas registradas hoy."
        />
      )}

      {tab === "semana" && semanaSeleccionada !== null && (
        <ReportTable<VentaSemanaDTO>
          columnas={[
            { header: "Día", render: (v) => formatearDiaCorto(v.dia) },
            { header: "Cantidad de Ventas", render: (v) => v.cantidadVentas },
            {
              header: "Total",
              render: (v) => formatoMoneda.format(v.total),
              align: "right",
            },
          ]}
          filas={reporteSemana.data?.tabla ?? []}
          keyExtractor={(v) => v.dia}
          emptyMessage="No hay ventas registradas en esta semana."
        />
      )}

      {tab === "semana" && semanaSeleccionada === null && (
        <p className="text-slate-400 text-sm text-center py-8">
          Seleccioná una semana en el calendario para ver el detalle.
        </p>
      )}

      {tab === "mes" && (
        <ReportTable<VentaMesDTO>
          columnas={[
            { header: "Semana", render: (v) => `Semana ${v.semana}` },
            { header: "Cantidad de Ventas", render: (v) => v.cantidadVentas },
            {
              header: "Total",
              render: (v) => formatoMoneda.format(v.total),
              align: "right",
            },
          ]}
          filas={reporteMes.data?.tabla ?? []}
          keyExtractor={(v) => v.semana}
          onRowClick={(v) => irASemana(v.semana)}
          emptyMessage="No hay ventas registradas este mes."
        />
      )}

      {/* Ranking de productos más vendidos — dato real, ya no mock */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award size={18} className="text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Top 10 Productos Más Vendidos
          </h2>
        </div>

        <ReportTable<ProductoMasVendidoDTO>
          columnas={[
            { header: "Ranking", render: (_v, i) => `#${i + 1}` },
            { header: "Producto", render: (v) => v.nombreProducto },
            { header: "Cantidad Vendida", render: (v) => v.cantidadVendida },
          ]}
          filas={productosMasVendidos.data ?? []}
          keyExtractor={(v) => v.idProducto}
          emptyMessage="No hay datos de ventas disponibles."
        />
      </div>
    </div>
  );
}