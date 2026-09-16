import { Producto } from "@/types/producto";

// Puramente de UI — no refleja ningún DTO del backend. Se envuelve en
// vez de extender Producto para no chocar con Producto.cantidad (que
// significa "stock disponible", no "cantidad en el carrito").
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
