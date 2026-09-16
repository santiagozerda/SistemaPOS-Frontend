"use client";

import { useQuery } from "@tanstack/react-query";

import { findByNumeroTicket, findTicket, findTicketByVenta } from "@/services/ticket-service";

export function useTicket(idTicket: number | null, enabled = true) {
  return useQuery({
    queryKey: ["ticket", idTicket],
    queryFn: () => findTicket(idTicket as number),
    enabled: enabled && idTicket !== null,
  });
}

export function useTicketByVenta(idVenta: number | null, enabled = true) {
  return useQuery({
    queryKey: ["ticket-venta", idVenta],
    queryFn: () => findTicketByVenta(idVenta as number),
    enabled: enabled && idVenta !== null,
  });
}

// Búsqueda manual (Admin/Cajero) — no dispara sola, se activa recién
// cuando el usuario confirma la búsqueda (ver SaleIdSearch).
export function useTicketPorNumero(numeroTicket: string, enabled: boolean) {
  return useQuery({
    queryKey: ["ticket-numero", numeroTicket],
    queryFn: () => findByNumeroTicket(numeroTicket),
    enabled: enabled && numeroTicket.trim().length > 0,
    retry: false,
  });
}
