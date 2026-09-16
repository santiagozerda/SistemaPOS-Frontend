
export type MetodoPago = "EFECTIVO" | "TRANSFERENCIA";

// Refleja ReporteResumenDTO
export interface ReporteResumenDTO {
  totalVendido: number;
  cantidadVentas: number;
  promedioVenta: number;
}

// Refleja VentaDiaDTO
export interface VentaDiaDTO {
  numeroTicket: string;
  metodoPago: MetodoPago;
  total: number;
}

// Refleja VentaSemanaDTO
export interface VentaSemanaDTO {
  dia: string;
  cantidadVentas: number;
  total: number;
}

// Refleja VentaMesDTO
export interface VentaMesDTO {
  semana: number;
  cantidadVentas: number;
  total: number;
}

// Refleja ReporteVentaDTO<T>
export interface ReporteVentaDTO<T> {
  resumen: ReporteResumenDTO;
  tabla: T[];
}

// Refleja ProductosMasVendidosDTO
export interface ProductoMasVendidoDTO {
  idProducto: number;
  nombreProducto: string;
  cantidadVendida: number;
}


export interface SemanaDelMesDTO {
  numero: number;
  desde: string; 
  hasta: string; 
}