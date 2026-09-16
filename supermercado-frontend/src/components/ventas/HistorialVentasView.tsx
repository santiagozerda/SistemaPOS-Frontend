"use client";

import { useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import toast from "react-hot-toast";

import { useVentas } from "@/hooks/useVenta";
import { useTicketPorNumero } from "@/hooks/useTicket";
import VentaDetalleCompletoModal from "./VentaDetalleCompletoModal";

const METODO_PAGO_LABEL: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

// Ajustá las keys si tu EstadoPago real tiene otros valores — el
// fallback en el render muestra el valor crudo si no hay match, así
// que no rompe nada, solo pierde el estilo de badge.
const ESTADO_PAGO_BADGE: Record<string, string> = {
  APROBADO: "bg-green-100 text-green-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  RECHAZADO: "bg-red-100 text-red-700",
  ANULADO: "bg-slate-100 text-slate-600",
};

type TipoBusqueda = "ticket" | "idVenta";

interface Busqueda {
  tipo: TipoBusqueda;
  valor: string | number;
}

export default function HistorialVentasView() {
  const [input, setInput] = useState("");
  const [busqueda, setBusqueda] = useState<Busqueda | null>(null);
  const [idVentaSeleccionada, setIdVentaSeleccionada] = useState<number | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const { data: ventas = [], isLoading } = useVentas();

  // Solo se activa cuando la búsqueda es por número de ticket — hay que
  // resolver a qué idVenta corresponde antes de poder filtrar la tabla.
  const ticketPorNumero = useTicketPorNumero(
    busqueda?.tipo === "ticket" ? (busqueda.valor as string) : "",
    busqueda?.tipo === "ticket",
  );

  const handleSearch = () => {
    const term = input.trim();

    if (!term) {
      setBusqueda(null);
      return;
    }

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

  const handleClear = () => {
    setInput("");
    setBusqueda(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // ID de venta resuelto según el tipo de búsqueda activa.
  const idVentaResuelto = useMemo(() => {
    if (!busqueda) return null;
    if (busqueda.tipo === "idVenta") return busqueda.valor as number;
    return ticketPorNumero.data?.idVenta ?? null;
  }, [busqueda, ticketPorNumero.data]);

  const buscando = busqueda?.tipo === "ticket" && ticketPorNumero.isFetching;

  const ventasFiltradas = useMemo(() => {
    if (!busqueda) return ventas;
    if (idVentaResuelto === null) return [];
    return ventas.filter((v) => v.ventaId === idVentaResuelto);
  }, [ventas, busqueda, idVentaResuelto]);

  const sinResultados =
    busqueda !== null &&
    !buscando &&
    ((busqueda.tipo === "ticket" && ticketPorNumero.isError) ||
      (idVentaResuelto !== null && ventasFiltradas.length === 0));

  const abrirDetalle = (idVenta: number) => {
    setIdVentaSeleccionada(idVenta);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Historial Ventas</h1>
        <p className="text-slate-500">
          Buscá una venta por ID o por número de ticket
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="ID de venta (ej: 47) o número de ticket (ej: TCK-00000047)"
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

          {busqueda && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-700"
            >
              Limpiar
            </button>
          )}
        </div>

        {buscando && <p className="text-sm text-slate-400 mt-3">Buscando...</p>}
        {sinResultados && (
          <p className="text-sm text-red-500 mt-3">
            No se encontró ninguna venta con ese criterio.
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Resultados</h3>
          <span className="text-sm text-slate-400">
            {ventasFiltradas.length} venta
            {ventasFiltradas.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  ID Venta
                </th>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  Fecha
                </th>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  Método de Pago
                </th>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  Estado de Pago
                </th>
                <th className="p-4 text-right text-sm text-slate-500 font-medium">
                  Total
                </th>
                <th className="p-4 text-center text-sm text-slate-500 font-medium">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    Cargando ventas...
                  </td>
                </tr>
              ) : ventasFiltradas.length === 0 && !busqueda ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    No hay ventas registradas todavía.
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((venta) => (
                  <tr
                    key={venta.ventaId}
                    className="border-t hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-blue-600">
                      #{venta.ventaId}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {venta.fecha}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {venta.metodoPago
                        ? (METODO_PAGO_LABEL[venta.metodoPago] ??
                          venta.metodoPago)
                        : "—"}
                    </td>
                    <td className="p-4">
                      {venta.estadoPago ? (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            ESTADO_PAGO_BADGE[venta.estadoPago] ??
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {venta.estadoPago}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      ${venta.total.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => abrirDetalle(venta.ventaId)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Ver detalle de la venta"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VentaDetalleCompletoModal
        open={modalOpen}
        idVenta={idVentaSeleccionada}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
