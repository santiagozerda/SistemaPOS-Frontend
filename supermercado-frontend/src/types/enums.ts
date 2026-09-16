// Enums compartidos entre Venta, Pago y Ticket. Viven en un archivo
// propio (en vez de definirse dentro de venta.ts o pago.ts) para
// evitar imports circulares: ticket.ts necesita EstadoVenta y
// MetodoPago, mientras que venta.ts y pago.ts necesitan tipos de
// ticket.ts (TicketReferenciaDTO) — si los enums vivieran adentro de
// alguno de esos archivos, se generaría un ciclo de imports.

export type EstadoVenta = "PENDIENTE" | "APROBADA" | "CANCELADA" | "ANULADA";

export type MetodoPago = "EFECTIVO" | "TRANSFERENCIA";

export type EstadoPago = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "ANULADO";
