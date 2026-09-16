"use client";

import { useEffect, useState } from "react";
import { Banknote, QrCode } from "lucide-react";
import { MetodoPago } from "@/types/enums";

interface Props {
  open: boolean;
  total: number;
  onClose: () => void;
  onContinue: (metodo: MetodoPago, montoEntregado: number | null) => void;
}

export default function PaymentModal({
  open,
  total,
  onClose,
  onContinue,
}: Props) {
  const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");
  const [montoEntregado, setMontoEntregado] = useState("");

  useEffect(() => {
    if (open) {
      setMetodo("EFECTIVO");
      setMontoEntregado("");
    }
  }, [open]);

  if (!open) return null;

  const monto = Number(montoEntregado);
  const montoValido = metodo === "TRANSFERENCIA" || (monto > 0 && monto >= total);

  const handleContinue = () => {
    onContinue(
      metodo,
      metodo === "EFECTIVO" ? monto : null
    );
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />

      <div
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[420px] max-w-[92vw]
          bg-white rounded-3xl shadow-2xl overflow-hidden z-50
        "
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900">Método de pago</h2>
          <p className="text-slate-500 text-sm mt-1">
            Total a cobrar: <strong>${total.toLocaleString()}</strong>
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={() => setMetodo("EFECTIVO")}
              className={`
                flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors
                ${metodo === "EFECTIVO"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"}
              `}
            >
              <Banknote size={22} className={metodo === "EFECTIVO" ? "text-blue-600" : "text-slate-400"} />
              <span className="text-sm font-medium">Efectivo</span>
            </button>

            <button
              onClick={() => setMetodo("TRANSFERENCIA")}
              className={`
                flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors
                ${metodo === "TRANSFERENCIA"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"}
              `}
            >
              <QrCode size={22} className={metodo === "TRANSFERENCIA" ? "text-blue-600" : "text-slate-400"} />
              <span className="text-sm font-medium">Transferencia</span>
            </button>
          </div>

          <div className="mt-5">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Monto entregado por el cliente
            </label>

            <input
              type="number"
              value={montoEntregado}
              onChange={(e) => setMontoEntregado(e.target.value)}
              disabled={metodo === "TRANSFERENCIA"}
              placeholder={metodo === "TRANSFERENCIA" ? "No aplica" : "0"}
              className="
                w-full border border-slate-300 rounded-lg px-3 py-2.5
                disabled:bg-slate-100 disabled:text-slate-400
              "
            />

            {metodo === "EFECTIVO" && monto > 0 && monto < total && (
              <p className="text-xs text-red-500 mt-1">
                El monto entregado es menor al total.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleContinue}
            disabled={!montoValido}
            className="
              px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white
              transition-colors disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            Continuar
          </button>
        </div>
      </div>
    </>
  );
}
