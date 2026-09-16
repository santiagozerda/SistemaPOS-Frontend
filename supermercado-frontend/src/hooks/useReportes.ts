"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getProductosMasVendidos,
  getReporteDia,
  getReporteMes,
  getReporteSemana,
  getSemanasDelMes,
} from "@/services/reporte-service";

export function useReporteDia(enabled = true) {
  return useQuery({
    queryKey: ["reporte", "dia"],
    queryFn: getReporteDia,
    enabled,
  });
}

export function useReporteSemana(
  anio: number,
  mes: number,
  semana: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: ["reporte", "semana", anio, mes, semana],
    queryFn: () => getReporteSemana(anio, mes, semana as number),
    enabled: enabled && semana !== null,
  });
}

export function useReporteMes(anio: number, mes: number, enabled = true) {
  return useQuery({
    queryKey: ["reporte", "mes", anio, mes],
    queryFn: () => getReporteMes(anio, mes),
    enabled,
  });
}

export function useProductosMasVendidos() {
  return useQuery({
    queryKey: ["reporte", "productos-mas-vendidos"],
    queryFn: getProductosMasVendidos,
  });
}

export function useSemanasDelMes(anio: number, mes: number, enabled = true) {
  return useQuery({
    queryKey: ["reporte", "semanas-del-mes", anio, mes],
    queryFn: () => getSemanasDelMes(anio, mes),
    enabled,
  });
}