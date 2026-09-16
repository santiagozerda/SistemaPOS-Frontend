"use client";

import { Venta } from "@/types/venta";
import { MetodoPago } from "@/types/enums";
import { getPromotionLabel } from "@/components/promociones/promotions-types";

interface Props {
  open: boolean;
  venta: Venta | null;
  metodoPago: MetodoPago;
  isSubmitting?: boolean;
  onCancelarVenta: () => void;
  onConfirmarEfectivo: () => void;
  onGenerarQR: () => void;
}

export default function SaleDetailModal({
  open,
  venta,
  metodoPago,
  isSubmitting = false,
  onCancelarVenta,
  onConfirmarEfectivo,
  onGenerarQR,
}: Props) {
  if (!open || !venta) return null;

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
        <div className="p-6 border-b border-slate-200 shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Detalle de Venta</h2>
          <p className="text-slate-500 text-sm mt-1">
            Verificá los productos y el total antes de continuar.
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {venta.listaDetalle.map((item) => {
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

        <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0">
          {venta.totalDescuento > 0 && (
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-slate-500 text-xs">Descuento total</span>
              <span className="text-sm font-medium text-green-600">
                -${venta.totalDescuento.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-baseline mb-4">
            <span className="text-slate-500 text-sm">
              Método:{" "}
              <strong>
                {metodoPago === "EFECTIVO" ? "Efectivo" : "Transferencia"}
              </strong>
            </span>
            <span className="text-xl font-bold text-slate-900">
              ${venta.total.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancelarVenta}
              disabled={isSubmitting}
              className="
                px-5 py-2.5 rounded-xl border border-red-300 text-red-600 bg-white
                hover:bg-red-50 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Cancelar Venta
            </button>

            {metodoPago === "TRANSFERENCIA" ? (
              <button
                onClick={onGenerarQR}
                disabled={isSubmitting}
                className="
                  px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white
                  transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                Generar QR
              </button>
            ) : (
              <button
                onClick={onConfirmarEfectivo}
                disabled={isSubmitting}
                className="
                  px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white
                  transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                {isSubmitting ? "Procesando..." : "Confirmar Pago"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
