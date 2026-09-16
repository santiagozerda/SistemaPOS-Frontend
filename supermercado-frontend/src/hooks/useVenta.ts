"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  findVenta,
  anularVenta,
  cancelarVenta,
  crearVenta,
  getVentas,
  previewVenta,
} from "@/services/venta-service";
import { PRODUCTOS_QUERY_KEY } from "@/hooks/useProductos";
import { CrearVentaRequestDTO, VentaPreviewRequestDTO } from "@/types/venta";
import { DetalleVentaRequestDTO } from "@/types/detalleVenta";

export const VENTAS_QUERY_KEY = ["ventas"] as const;

export function useVentas() {
  return useQuery({
    queryKey: VENTAS_QUERY_KEY,
    queryFn: getVentas,
  });
}

export function useVenta(idVenta: number | null, enabled = true) {
  return useQuery({
    queryKey: ["venta", idVenta],
    queryFn: () => findVenta(idVenta as number),
    enabled: enabled && idVenta !== null,
  });
}

export function useCrearVenta() {
  return useMutation({
    mutationFn: (dto: CrearVentaRequestDTO) => crearVenta(dto),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCancelarVenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idVenta: number) => cancelarVenta(idVenta),
    onSuccess: () => {
      toast.success("Venta cancelada");
      queryClient.invalidateQueries({ queryKey: VENTAS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAnularVenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idVenta: number) => anularVenta(idVenta),
    onSuccess: () => {
      toast.success("Venta anulada");
      queryClient.invalidateQueries({ queryKey: VENTAS_QUERY_KEY });
      // El stock devuelto por la anulación afecta a Productos/Stock
      // también, así que invalidamos esa data para que no quede vieja.
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

const DEBOUNCE_MS = 400;

/**
 * Preview del total real (con promociones ya calculadas por el
 * backend) mientras el cajero arma el carrito. Debounced para no
 * pegarle al backend en cada click de +/-. `enabled=false` deja el
 * hook inactivo (ej. mientras el carrito está vacío).
 */
export function usePreviewVenta(
  detalles: DetalleVentaRequestDTO[],
  enabled = true
) {
  const [debounced, setDebounced] = useState(detalles);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(detalles), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(detalles)]);

  return useQuery({
    queryKey: ["venta-preview", debounced],
    queryFn: () =>
      previewVenta({ listDetalle: debounced } as VentaPreviewRequestDTO),
    enabled: enabled && debounced.length > 0,
  });
}
