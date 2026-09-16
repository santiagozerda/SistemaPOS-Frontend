import { EstadoVenta, MetodoPago } from "./enums";
import { TipoPromocion } from "./promocion";

// Refleja TicketReferenciaDTO — el objeto liviano embebido en
// PagoResponseDTO.ticket y VentaCompletaDTO.ticket (ver B.8).
export interface TicketReferenciaDTO {
  idTicket: number;
  numeroTicket: string;
}

// Refleja TicketDetalleDTO
export interface TicketDetalleDTO {
  idProducto: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subTotal: number;
  precioFinal: number;
  promoAplicada: TipoPromocion;
  descuentoAplicado: number;
}

// Refleja TicketDTO. Incluye estadoVenta (agregado para B.5) — se usa
// para pintar el sello "ANULADO" sin necesitar una segunda llamada a
// GET /app/venta/{idVenta}.
export interface TicketDTO {
  idTicket: number;
  numeroTicket: string;
  fecha: string;
  sucursal: SucursalTicketDTO;
  total: number;
  metodoPago: MetodoPago;
  montoRecibido: number;
  vuelto: number;
  nombreCliente: string;
  idVenta: number;
  listDetalle: TicketDetalleDTO[];
  estadoVenta: EstadoVenta;
}

export interface SucursalTicketDTO {
  id: number;
  nombre: string;
  provincia: string;
  localidad: string;
  direccion: string;
  telefono: string;
}