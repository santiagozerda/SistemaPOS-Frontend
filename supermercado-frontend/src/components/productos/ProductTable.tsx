import { Pencil, Trash2 } from "lucide-react";
import { Producto } from "@/types/producto";
import { getPromotionLabel } from "@/components/promociones/promotions-types";
import { UMBRAL_STOCK_BAJO } from "@/constants/stock";

interface ProductTableProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

export default function ProductTable({
  productos,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left p-4">Producto</th>
            <th className="text-left p-4">Categoría</th>
            <th className="text-left p-4">Precio</th>
            <th className="text-left p-4">Stock</th>
            <th className="text-left p-4">Promoción</th>
            <th className="text-center p-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((producto) => {
            // El backend siempre devuelve un `promo` (usa SIN_PROMOCION
            // como placeholder), nunca null — por eso se chequea el tipo,
            // no la existencia del objeto.
            const tienePromoReal = producto.promo.tipo !== "SIN_PROMOCION";

            return (
              <tr key={producto.id} className="border-t border-slate-100">
                <td className="p-4">{producto.nombre}</td>

                <td className="p-4">{producto.categoria}</td>

                <td className="p-4">${producto.precio}</td>

                <td className="p-4">
                  <span
                    className={
                      producto.cantidad <= UMBRAL_STOCK_BAJO
                        ? "text-red-500 font-semibold"
                        : ""
                    }
                  >
                    {producto.cantidad}
                  </span>
                </td>

                <td className="p-4">
                  {tienePromoReal ? (
                    <span
                      className="
                        bg-green-100
                        text-green-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                      "
                    >
                      {producto.promo.descripcion} —{" "}
                      {getPromotionLabel(producto.promo.tipo)}
                    </span>
                  ) : (
                    <span className="text-slate-500">Sin promoción</span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(producto)}
                      className="
                        text-blue-600
                        hover:text-blue-800
                      "
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(producto)}
                      className="
                        text-red-600
                        hover:text-red-800
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {productos.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center text-slate-400 text-sm py-8"
              >
                No hay productos que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
