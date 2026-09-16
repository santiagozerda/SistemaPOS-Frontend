"use client";

import { useState } from "react";
import { Receipt, Search } from "lucide-react";
import toast from "react-hot-toast";

import { useTicketByVenta, useTicketPorNumero } from "@/hooks/useTicket";
import { useAnularVenta } from "@/hooks/useVenta";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TicketContent from "./TicketContent";

type TipoBusqueda = "ticket" | "idVenta";

interface Busqueda {
  tipo: TipoBusqueda;
  valor: string | number;
}

export default function SaleIdSearch() {
  const [input, setInput] = useState("");
  const [busqueda, setBusqueda] = useState<Busqueda | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const porNumero = useTicketPorNumero(
    busqueda?.tipo === "ticket" ? (busqueda.valor as string) : "",
    busqueda?.tipo === "ticket",
  );

  const porIdVenta = useTicketByVenta(
    busqueda?.tipo === "idVenta" ? (busqueda.valor as number) : null,
    busqueda?.tipo === "idVenta",
  );

  // Según el formato detectado, uno de los dos hooks queda activo y
  // el otro deshabilitado — se lee siempre del que corresponda.
  const ticket = busqueda?.tipo === "ticket" ? porNumero.data : porIdVenta.data;
  const isLoading =
    busqueda?.tipo === "ticket" ? porNumero.isLoading : porIdVenta.isLoading;
  const isError =
    busqueda?.tipo === "ticket" ? porNumero.isError : porIdVenta.isError;
  const refetch =
    busqueda?.tipo === "ticket" ? porNumero.refetch : porIdVenta.refetch;

  const anularVenta = useAnularVenta();

  const handleSearch = () => {
    const term = input.trim();
    if (!term) return;

    if (/^tck-\d+$/i.test(term)) {
      setBusqueda({ tipo: "ticket", valor: term.toUpperCase() });
      return;
    }

    if (/^\d+$/.test(term)) {
      setBusqueda({ tipo: "idVenta", valor: Number(term) });
      return;
    }

    toast.error(
      "Formato inválido. Ingresá un ID de venta (ej: 47) o un número de ticket (ej: TCK-00000047).",
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAnularConfirm = () => {
    if (!ticket) return;
    anularVenta.mutate(ticket.idVenta, {
      onSuccess: () => {
        setConfirmOpen(false);
        refetch();
      },
    });
  };

  const puedeAnular = ticket && ticket.estadoVenta === "APROBADA";
  const esTransferencia = ticket?.metodoPago === "TRANSFERENCIA";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Receipt size={18} className="text-slate-500" />
        <h3 className="font-semibold text-slate-800">
          Buscar Venta por ID o Número de Ticket
        </h3>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="ID de venta (ej: 47) o número de ticket (ej: TCK-00000123)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          "
        />

        <button
          onClick={handleSearch}
          className="
            flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            px-5 py-2.5 rounded-lg text-sm font-medium transition-colors
          "
        >
          <Search size={15} />
          Buscar
        </button>
      </div>

      {isLoading && <p className="text-sm text-slate-400 mt-3">Buscando...</p>}

      {isError && (
        <p className="text-sm text-red-500 mt-3">
          No se encontró ninguna venta con ese criterio.
        </p>
      )}

      {ticket && (
        <div className="mt-5 border-t pt-5">
          <TicketContent ticket={ticket} />

          {puedeAnular && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setConfirmOpen(true)}
                className="
                  text-red-600 hover:text-red-800 text-sm font-medium
                  border border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg
                  transition-colors
                "
              >
                Anular Venta
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Anular la venta ${ticket?.numeroTicket ?? ""}?`}
        description={
          esTransferencia
            ? "Esta venta se pagó por Transferencia. Anular acá restaura el stock y registra la anulación en el sistema, pero NO reembolsa el dinero al cliente automáticamente — eso hay que gestionarlo manualmente desde MercadoPago."
            : "Se restaurará el stock de los productos vendidos y la venta quedará excluida de los reportes."
        }
        confirmLabel="Anular"
        variant="danger"
        isConfirming={anularVenta.isPending}
        onConfirm={handleAnularConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
