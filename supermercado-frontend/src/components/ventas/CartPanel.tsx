import { Minus, Plus, Tag, Trash2 } from "lucide-react";
import { ItemCarrito } from "./carrito-types";
import { getPromotionLabel } from "@/components/promociones/promotions-types";

interface Props {
  items: ItemCarrito[];
  onIncrease: (idProducto: number) => void;
  onDecrease: (idProducto: number) => void;
  onRemove: (idProducto: number) => void;
}

export default function CartPanel({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-8">
        El carrito está vacío. Agregá productos desde la lista.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(({ producto, cantidad }) => {
        const tienePromo = producto.promo.tipo !== "SIN_PROMOCION";

        return (
          <div
            key={producto.id}
            className="border-b border-slate-100 pb-3"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm text-slate-800 truncate">
                  {producto.nombre}
                </p>
                <p className="text-xs text-slate-400">
                  ${producto.precio.toLocaleString()} c/u
                </p>

                {tienePromo && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      text-xs
                      text-green-600
                      mt-0.5
                    "
                  >
                    <Tag size={11} />
                    {getPromotionLabel(producto.promo.tipo)}
                  </span>
                )}
              </div>

              <button
                onClick={() => onRemove(producto.id)}
                className="text-red-500 hover:text-red-700 shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onDecrease(producto.id)}
                className="
                  w-7
                  h-7
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-300
                  hover:bg-slate-100
                "
              >
                <Minus size={13} />
              </button>

              <span className="w-6 text-center text-sm font-medium">
                {cantidad}
              </span>

              <button
                onClick={() => onIncrease(producto.id)}
                disabled={cantidad >= producto.cantidad}
                className="
                  w-7
                  h-7
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-300
                  hover:bg-slate-100
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
