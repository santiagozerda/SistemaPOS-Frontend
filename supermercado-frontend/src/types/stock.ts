// Refleja AjustarStockDTO del backend. El campo se llama
// "cantidadIngresada" porque el backend SUMA este valor al stock
// actual — nunca se manda el total resultante.
export interface AjustarStockDTO {
  idProducto: number;
  cantidadIngresada: number;
}
