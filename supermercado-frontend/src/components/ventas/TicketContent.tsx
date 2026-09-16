import { TicketDTO } from "@/types/ticket";
import { getPromotionLabel } from "@/components/promociones/promotions-types";

interface Props {
  ticket: TicketDTO;
}

const METODO_PAGO_LABEL: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

function formatFecha(iso: string) {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString("es-AR");
  const hora = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return { fecha, hora };
}

function formatFechaCorta(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function TicketContent({ ticket }: Props) {
  const anulado = ticket.estadoVenta === "ANULADA";
  const { fecha, hora } = formatFecha(ticket.fecha);
  const { sucursal } = ticket;

  return (
    <div className="space-y-4 font-mono text-sm">
      {anulado && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-2.5 rounded-xl text-center">
          VENTA ANULADA
        </div>
      )}

      {/* Encabezado del comercio */}
      <div className="text-center space-y-0.5">
        <p className="font-bold text-slate-900 text-base">{sucursal.nombre}</p>
        <p className="text-xs text-slate-500">{sucursal.direccion}</p>
        <p className="text-xs text-slate-500">
          {sucursal.localidad} - {sucursal.provincia}
        </p>
      </div>

      {/* Número, fecha y hora */}
      <div className="text-center border-t border-slate-100 pt-2">
        <p className="font-bold text-slate-900">TICKET N° {ticket.numeroTicket}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Fecha: {fecha} &nbsp;&nbsp; Hora: {hora}
        </p>
      </div>

      {/* Cliente y condición de venta */}
      <div className="text-xs text-slate-600 border-t border-slate-100 pt-2 space-y-0.5">
        <p>Cliente: {ticket.nombreCliente}</p>
        <p>Condición de venta: {METODO_PAGO_LABEL[ticket.metodoPago] ?? ticket.metodoPago}</p>
      </div>

      {/* Detalle de productos */}
      <div className="space-y-2 border-t border-b border-slate-100 py-3">
        {ticket.listDetalle.map((item) => {
          const tienePromo = item.promoAplicada !== "SIN_PROMOCION";

          return (
            <div key={item.idProducto} className="flex justify-between text-sm">
              <div>
                <p className="text-slate-800">{item.productoNombre}</p>
                <p className="text-xs text-slate-400">
                  x{item.cantidad} × ${item.precioUnitario.toLocaleString()}
                </p>
                {tienePromo && (
                  <p className="text-xs text-green-600">
                    {getPromotionLabel(item.promoAplicada)}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-slate-800">${item.subTotal.toLocaleString()}</p>
                {item.descuentoAplicado > 0 && (
                  <p className="text-xs text-green-600">
                    -${item.descuentoAplicado.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Totales: total, efectivo entregado, vuelto (siempre visible) */}
      <div className="space-y-1">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-slate-500">TOTAL</span>
          <span className="text-xl font-bold text-slate-900">
            ${ticket.total.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{METODO_PAGO_LABEL[ticket.metodoPago] ?? ticket.metodoPago}</span>
          <span>${ticket.montoRecibido.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>VUELTO</span>
          <span>${ticket.vuelto.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}