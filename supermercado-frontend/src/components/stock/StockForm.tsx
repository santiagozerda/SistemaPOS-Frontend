"use client";

import { useEffect, useState } from "react";
import { Producto } from "@/types/producto";

interface Props {
  producto: Producto | null;
  onAdjustStock?: (idProducto: number, cantidadIngresada: number) => void;
  isSubmitting?: boolean;
}

export default function StockForm({
  producto,
  onAdjustStock,
  isSubmitting = false,
}: Props) {
  const [cantidadIngreso, setCantidadIngreso] = useState(0);

  useEffect(() => {
    setCantidadIngreso(0);
  }, [producto]);

  if (!producto) return null;

  const nuevoStock = producto.cantidad + cantidadIngreso;

  const handleAdjust = () => {
    if (!onAdjustStock || cantidadIngreso === 0) return;

    // El backend espera la cantidad a INGRESAR (delta), no el total
    // resultante — antes acá se mandaba `nuevoStock`, lo que hacía que
    // el backend sumara de nuevo sobre el stock actual y duplicara el
    // ajuste.
    onAdjustStock(producto.id, cantidadIngreso);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500">
          Producto
        </label>

        <input
          disabled
          value={producto.nombre}
          className="w-full border rounded-lg px-3 py-2.5 bg-slate-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          disabled
          value={producto.codigoBarra}
          className="border rounded-lg px-3 py-2.5 bg-slate-100"
        />

        <input
          disabled
          value={producto.categoria}
          className="border rounded-lg px-3 py-2.5 bg-slate-100"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Stock Actual
        </label>

        <input
          disabled
          value={producto.cantidad}
          className="w-full border rounded-lg px-3 py-2.5 bg-slate-100"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Ingreso de Stock
        </label>

        <input
          type="number"
          value={cantidadIngreso}
          onChange={(e) => setCantidadIngreso(Number(e.target.value))}
          className="
            w-full
            border
            rounded-lg
            px-3
            py-2.5
          "
        />
      </div>

      <div
        className="
          bg-yellow-50
          border
          border-yellow-200
          rounded-xl
          p-4
        "
      >
        <p className="text-sm text-slate-500">Resultado</p>

        <p className="font-bold text-xl">
          {producto.cantidad}
          {" + "}
          {cantidadIngreso}
          {" = "}
          {nuevoStock}
        </p>
      </div>

      <button
        onClick={handleAdjust}
        disabled={isSubmitting || cantidadIngreso === 0}
        className="
          w-full
          bg-yellow-500
          hover:bg-yellow-600
          text-white
          py-3
          rounded-xl
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isSubmitting ? "Actualizando..." : "Actualizar Stock"}
      </button>
    </div>
  );
}
