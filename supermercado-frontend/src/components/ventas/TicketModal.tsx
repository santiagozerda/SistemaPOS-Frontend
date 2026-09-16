"use client";

import { Printer, X } from "lucide-react";
import { useTicket } from "@/hooks/useTicket";
import TicketContent from "./TicketContent";

interface Props {
  open: boolean;
  idTicket: number | null;
  onClose: () => void;
}

export default function TicketModal({ open, idTicket, onClose }: Props) {
  const { data: ticket, isLoading } = useTicket(idTicket, open);

  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      <div
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[420px] max-w-[92vw] max-h-[85vh]
          bg-white rounded-3xl shadow-2xl overflow-hidden z-50
          flex flex-col
        "
      >
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading || !ticket ? (
            <p className="text-slate-400 text-sm text-center py-10">
              Cargando ticket...
            </p>
          ) : (
            <TicketContent ticket={ticket} />
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              border border-slate-300 bg-white hover:bg-slate-100 transition-colors
            "
          >
            <X size={15} />
            Cerrar sin imprimir
          </button>

          <button
            onClick={handlePrint}
            disabled={!ticket}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-blue-600 hover:bg-blue-700 text-white transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <Printer size={15} />
            Imprimir
          </button>
        </div>
      </div>
    </>
  );
}
