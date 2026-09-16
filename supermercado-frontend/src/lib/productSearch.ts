import { Producto } from "@/types/producto";

export function filtrarProductosPorBusqueda(
  productos: Producto[],
  termino: string
): Producto[] {
  const term = termino.trim();

  if (!term) return productos;

  const esNumerico = /^\d+$/.test(term);

  if (esNumerico) {
    if (term.length <= 6) {
      return productos.filter((p) => p.codigoBarra.endsWith(term));
    }
    return productos.filter((p) => p.codigoBarra === term);
  }

  return productos.filter((p) =>
    p.nombre.toLowerCase().includes(term.toLowerCase())
  );
}