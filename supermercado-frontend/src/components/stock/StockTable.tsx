import { Eye } from "lucide-react";
import { Producto } from "@/types/producto";
import { UMBRAL_STOCK_BAJO } from "@/constants/stock";

interface Props {
  productos: Producto[];
  onView: (producto: Producto) => void;
}

export default function StockTable({ productos, onView }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4 text-left">Producto</th>
            <th className="p-4 text-left">Categoría</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-center">Acción</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((producto) => {
            const agotado = producto.cantidad === 0;

            const bajo =
              producto.cantidad > 0 && producto.cantidad <= UMBRAL_STOCK_BAJO;

            return (
              <tr key={producto.id} className="border-t">
                <td className="p-4">{producto.nombre}</td>

                <td className="p-4">{producto.categoria}</td>

                <td className="p-4">{producto.cantidad}</td>

                <td className="p-4">
                  {agotado ? (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Agotado
                    </span>
                  ) : bajo ? (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Bajo
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Disponible
                    </span>
                  )}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => onView(producto)}
                    className="text-blue-600"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            );
          })}

          {productos.length === 0 && (
            <tr>
              <td
                colSpan={5}
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
