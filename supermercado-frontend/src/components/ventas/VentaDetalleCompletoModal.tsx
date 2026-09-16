"use client";

import { X } from "lucide-react";
import { useVenta } from "@/hooks/useVenta";
import { getPromotionLabel } from "@/components/promociones/promotions-types";

interface Props {
  open: boolean;
  idVenta: number | null;
  onClose: () => void;
}

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente",
  APROBADA: "Aprobada",
  CANCELADA: "Cancelada",
  ANULADA: "Anulada",
};

export default function VentaDetalleCompletoModal({
  open,
  idVenta,
  onClose,
}: Props) {
  const { data: venta, isLoading } = useVenta(
    idVenta,
    open && idVenta !== null,
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      <div
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[560px] max-w-[92vw] max-h-[85vh]
          bg-white rounded-3xl shadow-2xl overflow-hidden z-50
          flex flex-col
        "
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Detalle de Venta
            </h2>
            {venta && (
              <p className="text-slate-500 text-sm mt-1">
                Venta #{venta.id} —{" "}
                {ESTADO_LABEL[venta.estadoVenta] ?? venta.estadoVenta}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {isLoading && (
            <p className="text-sm text-slate-400 text-center">
              Cargando detalle...
            </p>
          )}

          {venta?.listaDetalle.map((item) => {
            const tienePromo = item.promo !== "SIN_PROMOCION";

            return (
              <div
                key={item.idProducto}
                className="flex justify-between border-b border-slate-100 pb-2"
              >
                <div>
                  <p className="text-sm text-slate-800">
                    {item.nombreProducto}
                  </p>
                  <p className="text-xs text-slate-500">
                    Cantidad: {item.cantidadVendida} × $
                    {item.precioUnitario.toLocaleString()}
                  </p>
                  {tienePromo && (
                    <p className="text-xs text-green-600 mt-0.5">
                      {getPromotionLabel(item.promo)}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-800">
                    ${item.subTotal.toLocaleString()}
                  </p>
                  {item.descuAplicado > 0 && (
                    <p className="text-xs text-green-600">
                      -${item.descuAplicado.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {venta && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0">
            {venta.totalDescuento > 0 && (
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-slate-500 text-xs">Descuento total</span>
                <span className="text-sm font-medium text-green-600">
                  -${venta.totalDescuento.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500 text-sm">TOTAL</span>
              <span className="text-xl font-bold text-slate-900">
                ${venta.total.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
