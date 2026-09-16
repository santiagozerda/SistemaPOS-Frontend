"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import { useVentas } from "@/hooks/useVenta";
import SaleIdSearch from "./SaleIdSearch";
import VentaDetalleCompletoModal from "./VentaDetalleCompletoModal";

const ESTADO_BADGE: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  APROBADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-slate-100 text-slate-600",
  ANULADA: "bg-red-100 text-red-700",
};

const METODO_PAGO_LABEL: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

// Ajustá las keys si tu EstadoPago real tiene otros valores — el
// fallback muestra el texto crudo si no hay match.
const ESTADO_PAGO_BADGE: Record<string, string> = {
  APROBADO: "bg-green-100 text-green-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  RECHAZADO: "bg-red-100 text-red-700",
  ANULADO: "bg-slate-100 text-slate-600",
};

const COLUMN_COUNT = 8;

export default function AdminVentasPanel() {
  const { data: ventas = [], isLoading } = useVentas();

  const [idVentaSeleccionada, setIdVentaSeleccionada] = useState<number | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  const abrirDetalle = (idVenta: number) => {
    setIdVentaSeleccionada(idVenta);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ventas</h1>
        <p className="text-slate-500">Historial y auditoría de ventas</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Historial General</h3>
          <span className="text-sm text-slate-400">
            {ventas.length} venta{ventas.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  ID
                </th>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  Fecha
                </th>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  Estado
                </th>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  Método de Pago
                </th>
                <th className="p-4 text-left text-sm text-slate-500 font-medium">
                  Estado de Pago
                </th>
                <th className="p-4 text-right text-sm text-slate-500 font-medium">
                  Descuento
                </th>
                <th className="p-4 text-right text-sm text-slate-500 font-medium">
                  Total
                </th>
                <th className="p-4 text-center text-sm text-slate-500 font-medium">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    Cargando ventas...
                  </td>
                </tr>
              ) : ventas.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    No hay ventas registradas todavía.
                  </td>
                </tr>
              ) : (
                ventas.map((venta) => (
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
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_BADGE[venta.estadoVenta] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {venta.estadoVenta}
                      </span>
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
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
                    <td className="p-4 text-right text-sm text-green-600">
                      {venta.totalDescuento > 0
                        ? `-$${venta.totalDescuento.toLocaleString()}`
                        : "—"}
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

      <SaleIdSearch />

      <VentaDetalleCompletoModal
        open={modalOpen}
        idVenta={idVentaSeleccionada}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
