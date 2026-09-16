"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { usePagoPolling } from "@/hooks/usePago";

interface Props {
  open: boolean;
  ventaId: number | null;
  initPoint: string | null;
  onAprobado: () => void;
  onCancelar: () => void;
}

// Genera la imagen del QR a partir de la URL de pago (initPoint) sin
// agregar ninguna librería nueva al proyecto — usa un servicio público
// gratuito de generación de QR. Si preferís no depender de un tercero,
// se puede reemplazar por una librería como `qrcode.react` más adelante;
// esto es la opción más simple para arrancar.
function qrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(data)}`;
}

export default function TransferenciaQRModal({
  open,
  ventaId,
  initPoint,
  onAprobado,
  onCancelar,
}: Props) {
  const { data: pago } = usePagoPolling(ventaId, open && initPoint !== null);
  const estado = pago?.estadoPago ?? "PENDIENTE";

  useEffect(() => {
    if (estado === "APROBADO") {
      onAprobado();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  if (!open || !initPoint) return null;


  if (estado === "APROBADO") {
    // El padre decide qué hacer (buscar el ticket y avanzar); evitamos
    // renderizar el QR ya resuelto.
    onAprobado();
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      <div
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[400px] max-w-[92vw]
          bg-white rounded-3xl shadow-2xl overflow-hidden z-50
        "
      >
        <div className="p-6 flex flex-col items-center text-center">
          <h2 className="text-lg font-bold text-slate-900">
            Escaneá para pagar
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Mostrale este código QR al cliente
          </p>

          <img
            src={qrImageUrl(initPoint)}
            alt="Código QR de pago"
            className="w-56 h-56 mt-5 rounded-xl border border-slate-200"
          />

          <div className="flex items-center gap-2 mt-5 text-slate-500 text-sm">
            {estado === "RECHAZADO" ? (
              <span className="text-red-600 font-medium">
                El pago fue rechazado
              </span>
            ) : (
              <>
                <Loader2 size={16} className="animate-spin" />
                Esperando confirmación del pago...
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onCancelar}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              border border-slate-300 bg-white hover:bg-slate-100 transition-colors
            "
          >
            <X size={15} />
            Cancelar Venta
          </button>
        </div>
      </div>
    </>
  );
}
