import { EstadoPago, MetodoPago } from "./enums";
import { TicketReferenciaDTO } from "./ticket";

// Refleja PagoRequestDTO
export interface PagoRequestDTO {
  ventaId: number;
  metodoPago: MetodoPago;
  totalPagar: number;
  montoEntregado?: number | null; // solo aplica para EFECTIVO
}

// Refleja PagoResponseDTO. El campo `ticket` SOLO viene poblado en el
// camino de EFECTIVO (se arma a mano dentro de PagoService.procesarPago).
// Para TRANSFERENCIA, el ticket se obtiene aparte con
// GET /app/ticket/venta/{idVenta} una vez que el polling detecta
// estadoPago=APROBADO — ver B.8 en el TXT de pendientes.
export interface PagoResponseDTO {
  idPago: number;
  idVenta: number;
  estadoPago: EstadoPago;
  monto: number;
  metodoPago: MetodoPago;
  fecha: string;
  ticket?: TicketReferenciaDTO | null;
}

// Refleja PagoTransferenciaRequestDTO
export interface PagoTransferenciaRequestDTO {
  ventaId: number;
}

// Refleja QRResponseDTO
export interface QRResponseDTO {
  ventaId: number;
  pagoId: number;
  estadoPago: EstadoPago;
  initPoint: string;
  preferenceId: string;
}
