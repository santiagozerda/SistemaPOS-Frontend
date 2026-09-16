"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import SaleSearch from "@/components/ventas/SaleSearch";
import ProductList from "@/components/ventas/ProductList";
import CartPanel from "@/components/ventas/CartPanel";
import SaleSummary from "@/components/ventas/SaleSummary";
import PaymentModal from "@/components/ventas/PaymentModal";
import SaleDetailModal from "@/components/ventas/SaleDetailModal";
import TransferenciaQRModal from "@/components/ventas/TransferenciaQRModal";
import TicketModal from "@/components/ventas/TicketModal";
import AdminVentasPanel from "@/components/ventas/AdminVentasPanel";
import { ItemCarrito } from "@/components/ventas/carrito-types";

import { useAuth } from "@/hooks/useAuth";
import { useProductos } from "@/hooks/useProductos";
import { useCancelarVenta, useCrearVenta, usePreviewVenta } from "@/hooks/useVenta";
import { useGenerarQR, useRegistrarPago } from "@/hooks/usePago";
import { useTicketByVenta } from "@/hooks/useTicket";

import { useSucursales } from "@/hooks/useSucursal";
import { Producto } from "@/types/producto";
import { Venta } from "@/types/venta";
import { MetodoPago } from "@/types/enums";
import { QRResponseDTO } from "@/types/pago";
import { filtrarProductosPorBusqueda } from "@/lib/productSearch";

// TKT-01: la búsqueda de ventas se movió a su propia sección
// ("Historial Ventas", accesible desde el Sidebar). Esta vista queda
// dedicada exclusivamente al registro/cobro de una venta nueva.
function CajeroVentasView() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<ItemCarrito[]>([]);

  // ── Pasos del checkout ──────────────────────────────────────────────
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPago>("EFECTIVO");
  const [montoEntregado, setMontoEntregado] = useState<number | null>(null);

  const [ventaCreada, setVentaCreada] = useState<Venta | null>(null);
  const [saleDetailOpen, setSaleDetailOpen] = useState(false);

  const [qrData, setQrData] = useState<QRResponseDTO | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [esperandoTicketTransferencia, setEsperandoTicketTransferencia] = useState(false);

  const [ticketId, setTicketId] = useState<number | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);

  // ── Catálogo real + búsqueda por nombre O código de barra ──────────
  // Todo el catálogo se trae una sola vez y se filtra en memoria — sin
  // llamadas de red por tecla. Si el término es numérico y tiene hasta
  // 6 dígitos, se busca por los últimos dígitos del código de barra
  // (mismo criterio que el código corto único del backend); si no, por
  // nombre.
  const { data: productos = [] } = useProductos();

  // Opción C confirmada: por ahora se opera con una sola sucursal, así
  // que se toma automáticamente la primera que devuelva el backend, sin
  // pedirle nada al cajero. Si en el futuro se abre una segunda
  // sucursal, acá es donde hay que agregar un selector real.
  const { data: sucursales = [], isLoading: cargandoSucursales } = useSucursales();
  const sucursalActiva = sucursales[0] ?? null;

  // TKT-03: búsqueda por nombre o código de barras, ahora compartida
  // con la sección Productos del Admin — misma función, mismo
  // comportamiento en ambos roles (filtrado progresivo por los
  // últimos dígitos + soporte para escaneo del código completo).
  const productosFiltrados = useMemo(
    () => filtrarProductosPorBusqueda(productos, search),
    [productos, search]
  );

  // ── Carrito ──────────────────────────────────────────────────────────
  const addProduct = (producto: Producto) => {
    setCart((current) => {
      const existing = current.find((i) => i.producto.id === producto.id);
      if (existing) {
        if (existing.cantidad >= producto.cantidad) return current;
        return current.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...current, { producto, cantidad: 1 }];
    });
  };

  const increaseQuantity = (idProducto: number) =>
    setCart((current) =>
      current.map((i) =>
        i.producto.id === idProducto && i.cantidad < i.producto.cantidad
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      )
    );

  const decreaseQuantity = (idProducto: number) =>
    setCart((current) =>
      current
        .map((i) =>
          i.producto.id === idProducto ? { ...i, cantidad: i.cantidad - 1 } : i
        )
        .filter((i) => i.cantidad > 0)
    );

  const removeProduct = (idProducto: number) =>
    setCart((current) => current.filter((i) => i.producto.id !== idProducto));

  const detallesCarrito = useMemo(
    () =>
      cart.map((i) => ({
        idProducto: i.producto.id,
        cantidadVendida: i.cantidad,
      })),
    [cart]
  );

  // ── Total real (con promociones), calculado por el backend ─────────
  const preview = usePreviewVenta(detallesCarrito, cart.length > 0);

  // ── Mutations del flujo de checkout ─────────────────────────────────
  const crearVenta = useCrearVenta();
  const cancelarVenta = useCancelarVenta();
  const registrarPago = useRegistrarPago();
  const generarQR = useGenerarQR();

  const ticketPorVenta = useTicketByVenta(
    ventaCreada?.id ?? null,
    esperandoTicketTransferencia
  );

  // Cuando el polling de Transferencia detecta APROBADO, se pide el
  // ticket por venta (ver B.8) y recién ahí se pasa al paso final.
  useEffect(() => {
    if (esperandoTicketTransferencia && ticketPorVenta.data) {
      setTicketId(ticketPorVenta.data.idTicket);
      setEsperandoTicketTransferencia(false);
      setQrOpen(false);
      setTicketOpen(true);
    }
  }, [esperandoTicketTransferencia, ticketPorVenta.data]);

  const resetCheckout = () => {
    setCart([]);
    setPaymentOpen(false);
    setVentaCreada(null);
    setSaleDetailOpen(false);
    setQrData(null);
    setQrOpen(false);
    setEsperandoTicketTransferencia(false);
    setTicketId(null);
    setTicketOpen(false);
    setMontoEntregado(null);
  };

  // Paso 1 -> 2: elegido el método, se crea la venta real en el
  // backend (PENDIENTE) para obtener el total con promociones ya
  // calculadas antes de mostrar el detalle.
  const handlePaymentContinue = (
    metodo: MetodoPago,
    monto: number | null
  ) => {
    if (!sucursalActiva) {
      toast.error(
        "No hay ninguna sucursal configurada. Pedile a un administrador que cree una en Configuración."
      );
      return;
    }

    setMetodoSeleccionado(metodo);
    setMontoEntregado(monto);

    crearVenta.mutate(
      { idSucursal: sucursalActiva.id, listaDetalle: detallesCarrito },
      {
        onSuccess: (venta) => {
          setVentaCreada(venta);
          setPaymentOpen(false);
          setSaleDetailOpen(true);
        },
      }
    );
  };

  const handleCancelarVenta = () => {
    if (!ventaCreada) return;
    cancelarVenta.mutate(ventaCreada.id, { onSuccess: resetCheckout });
  };

  const handleConfirmarEfectivo = () => {
    if (!ventaCreada) return;
    registrarPago.mutate(
      {
        ventaId: ventaCreada.id,
        metodoPago: "EFECTIVO",
        totalPagar: ventaCreada.total,
        montoEntregado,
      },
      {
        onSuccess: (pago) => {
          if (!pago.ticket) {
            toast.error("El pago se aprobó pero no se pudo obtener el ticket.");
            return;
          }
          setSaleDetailOpen(false);
          setTicketId(pago.ticket.idTicket);
          setTicketOpen(true);
        },
      }
    );
  };

  const handleGenerarQR = () => {
    if (!ventaCreada) return;
    generarQR.mutate(
      { ventaId: ventaCreada.id },
      {
        onSuccess: (qr) => {
          setSaleDetailOpen(false);
          setQrData(qr);
          setQrOpen(true);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ventas</h1>
        <p className="text-slate-500">Gestión de ventas</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <SaleSearch search={search} setSearch={setSearch} />
          <ProductList productos={productosFiltrados} onAdd={addProduct} />
        </div>

        <div className="col-span-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <h2 className="font-bold mb-4">Carrito</h2>

          <CartPanel
            items={cart}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeProduct}
          />

          {!cargandoSucursales && !sucursalActiva && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">
              No hay ninguna sucursal configurada — pedile a un
              administrador que cree una en Configuración antes de
              poder cobrar.
            </p>
          )}

          <SaleSummary
            total={preview.data?.total ?? null}
            isLoading={preview.isFetching}
            isError={preview.isError}
            disabled={cart.length === 0 || !sucursalActiva || cargandoSucursales}
            onCheckout={() => setPaymentOpen(true)}
          />
        </div>

        <PaymentModal
          open={paymentOpen}
          total={preview.data?.total ?? 0}
          onClose={() => setPaymentOpen(false)}
          onContinue={handlePaymentContinue}
        />

        <SaleDetailModal
          open={saleDetailOpen}
          venta={ventaCreada}
          metodoPago={metodoSeleccionado}
          isSubmitting={
            cancelarVenta.isPending || registrarPago.isPending || generarQR.isPending
          }
          onCancelarVenta={handleCancelarVenta}
          onConfirmarEfectivo={handleConfirmarEfectivo}
          onGenerarQR={handleGenerarQR}
        />

        <TransferenciaQRModal
          open={qrOpen}
          ventaId={ventaCreada?.id ?? null}
          initPoint={qrData?.initPoint ?? null}
          onAprobado={() => setEsperandoTicketTransferencia(true)}
          onCancelar={handleCancelarVenta}
        />

        <TicketModal
          open={ticketOpen}
          idTicket={ticketId}
          onClose={resetCheckout}
        />
      </div>
    </div>
  );
}

export default function VentasPage() {
  const { user } = useAuth();

  // Antes comparaba contra "ADMIN", que no existe en UserRole.
  return user.role === "ADMINISTRADOR" ? <AdminVentasPanel /> : <CajeroVentasView />;
}