import { PromocionDTO } from "./promocion";

// Refleja ProductoDTO del backend (ProductoController / ProductoService).
// El backend SIEMPRE devuelve un objeto `promo` (usa el placeholder
// SIN_PROMOCION cuando no hay ninguna asignada), nunca null/undefined.
export interface Producto {
  id: number;
  nombre: string;
  codigoBarra: string;
  categoria: string;
  precio: number;
  cantidad: number;
  promo: PromocionDTO;
}

// Refleja CrearProductoDTO del backend. Se usa tanto para crear como
// para editar (el controller reutiliza el mismo DTO en ambos casos).
export interface CrearProductoDTO {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  idPromo?: number | null;
  codigoBarra: string;
}
