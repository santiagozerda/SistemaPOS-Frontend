import { Plus, Tag } from "lucide-react";
import { Producto } from "@/types/producto";
import { getPromotionLabel } from "@/components/promociones/promotions-types";

interface Props {
  productos: Producto[];
  onAdd: (producto: Producto) => void;
}

export default function ProductList({ productos, onAdd }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {productos.map((producto) => {
        const tienePromo = producto.promo.tipo !== "SIN_PROMOCION";
        const sinStock = producto.cantidad <= 0;

        return (
          <div
            key={producto.id}
            className="
              bg-white
              border
              border-slate-200
              rounded-xl
              p-4
              flex
              flex-col
              gap-2
            "
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {producto.nombre}
                </p>
                <p className="text-sm text-slate-500">
                  ${producto.precio.toLocaleString()}
                </p>
              </div>

              {tienePromo && (
                <span
                  className="
                    shrink-0
                    flex
                    items-center
                    gap-1
                    bg-green-100
                    text-green-700
                    text-xs
                    px-2
                    py-1
                    rounded-full
                  "
                >
                  <Tag size={12} />
                  {getPromotionLabel(producto.promo.tipo)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`text-xs ${sinStock ? "text-red-500 font-medium" : "text-slate-400"}`}
              >
                {sinStock ? "Sin stock" : `Stock: ${producto.cantidad}`}
              </span>

              <button
                onClick={() => onAdd(producto)}
                disabled={sinStock}
                className="
                  flex
                  items-center
                  gap-1
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  px-3
                  py-1.5
                  rounded-lg
                  transition-colors
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                <Plus size={14} />
                Agregar
              </button>
            </div>
          </div>
        );
      })}

      {productos.length === 0 && (
        <p className="col-span-full text-center text-slate-400 text-sm py-10">
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
