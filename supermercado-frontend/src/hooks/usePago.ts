"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { generarQR, getPagoDeVenta, registrarPago } from "@/services/pago-service";
import { VENTAS_QUERY_KEY } from "@/hooks/useVenta";
import { PRODUCTOS_QUERY_KEY } from "@/hooks/useProductos";
import { PagoRequestDTO, PagoTransferenciaRequestDTO } from "@/types/pago";

export function useRegistrarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: PagoRequestDTO) => registrarPago(dto),
    onSuccess: () => {
      // Al aprobarse, la venta pasa a APROBADA y el stock baja —
      // invalidamos ambas listas para que no queden desactualizadas.
      queryClient.invalidateQueries({ queryKey: VENTAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useGenerarQR() {
  return useMutation({
    mutationFn: (dto: PagoTransferenciaRequestDTO) => generarQR(dto),
    onError: (err: Error) => toast.error(err.message),
  });
}

const POLLING_INTERVAL_MS = 3000;

/**
 * Polling del estado del pago por Transferencia. Se detiene solo
 * (refetchInterval devuelve false) apenas el estado deja de ser
 * PENDIENTE — no sigue pegándole al backend después de resuelto.
 */
export function usePagoPolling(ventaId: number | null, enabled: boolean) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["pago-polling", ventaId],
    queryFn: () => getPagoDeVenta(ventaId as number),
    enabled: enabled && ventaId !== null,
    refetchInterval: (query) => {
      const estado = query.state.data?.estadoPago;
      if (estado === "PENDIENTE" || estado === undefined) {
        return POLLING_INTERVAL_MS;
      }

      if (estado === "APROBADO") {
        queryClient.invalidateQueries({ queryKey: VENTAS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
      }

      return false;
    },
  });
}
