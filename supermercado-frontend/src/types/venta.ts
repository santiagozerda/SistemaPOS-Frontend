import { EstadoVenta, MetodoPago, EstadoPago } from "./enums";
import { DetalleVentaDTO, DetalleVentaRequestDTO } from "./detalleVenta";
import { TicketReferenciaDTO } from "./ticket";

// Refleja VentaResumenDTO — usado en el listado GET /app/venta
export interface VentaResumenDTO {
  ventaId: number;
  fecha: string;
  idSucursal: number;
  estadoVenta: EstadoVenta;
  total: number;
  totalDescuento: number;
  metodoPago: MetodoPago | null;
  estadoPago: EstadoPago | null;
}

// Refleja VentaCompletaDTO — detalle completo de una venta.
// Incluye `ticket` (TicketReferenciaDTO), agregado para B.8.
export interface Venta {
  id: number;
  fecha: string;
  idSucursal: number;
  estadoVenta: EstadoVenta;
  listaDetalle: DetalleVentaDTO[];
  total: number;
  totalDescuento: number;
  ticket?: TicketReferenciaDTO | null;
}

// Refleja CrearVentaRequestDTO. El backend tiene un campo `fecha` en
// este DTO pero VentaService.saveVenta() lo IGNORA por completo (usa
// LocalDateTime.now() hardcodeado) — por eso no lo mandamos desde acá.
export interface CrearVentaRequestDTO {
  idSucursal: number;
  listaDetalle: DetalleVentaRequestDTO[];
}

// Refleja el endpoint nuevo POST /app/venta/preview
export interface VentaPreviewRequestDTO {
  listDetalle: DetalleVentaRequestDTO[];
}

export interface VentaPreviewDTO {
  listaDetalle: DetalleVentaDTO[];
  total: number;
}
