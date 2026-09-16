import { TipoPromocion } from "./promocion";

// Refleja DetalleVentaDTO. Se usa tanto en VentaCompletaDTO.listaDetalle
// como en VentaPreviewResponseDTO.listaDetalle — mismo shape en ambos.
export interface DetalleVentaDTO {
  idProducto: number;
  nombreProducto: string;
  cantidadVendida: number;
  precioUnitario: number;
  subTotal: number;
  promo: TipoPromocion;
  descuAplicado: number;
}

// Refleja DetalleVentaRequestDTO — lo que se manda al crear o
// previsualizar una venta.
export interface DetalleVentaRequestDTO {
  idProducto: number;
  cantidadVendida: number;
}
