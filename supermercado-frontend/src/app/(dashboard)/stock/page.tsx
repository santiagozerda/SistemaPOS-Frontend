"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AlertTriangle, Boxes, Package, XCircle } from "lucide-react";

import StockHeader from "@/components/stock/StockHeader";
import StockKpiCard from "@/components/stock/StockKpiCard";
import StockTable from "@/components/stock/StockTable";
import StockForm from "@/components/stock/StockForm";

import FormModal from "@/components/ui/FormModal";

import { Producto } from "@/types/producto";
import { useAuth } from "@/hooks/useAuth";
import { useStockProductos, useAjustarStock } from "@/hooks/useStock";
import { UMBRAL_STOCK_BAJO } from "@/constants/stock";

type FiltroActivo = "bajo" | "sinStock" | null;

interface Props {
  // CR-01: cuando Productos (rol Cajero) renderiza este contenido embebido,
  // se saltea el guard de rol/redirect propio de la ruta "/stock".
  embedded?: boolean;
}

export default function StockPage({ embedded = false }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  // Antes comparaba contra "ADMIN", que no existe en UserRole.
  const isAdmin = user.role === "ADMINISTRADOR";

  useEffect(() => {
    if (!embedded && !isAdmin) {
      router.replace("/productos");
    }
  }, [embedded, isAdmin, router]);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FiltroActivo>(null);

  const { data: productos = [], isLoading } = useStockProductos();
  const ajustarStock = useAjustarStock();

  const handleFilterClick = (filtro: FiltroActivo) => {
    setActiveFilter((current) => (current === filtro ? null : filtro));
  };

  const filteredProducts = useMemo(() => {
    let result = productos.filter((p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (activeFilter === "bajo") {
      result = result.filter(
        (p) => p.cantidad > 0 && p.cantidad <= UMBRAL_STOCK_BAJO
      );
    } else if (activeFilter === "sinStock") {
      result = result.filter((p) => p.cantidad === 0);
    }

    return result;
  }, [productos, search, activeFilter]);

  const stockBajo = productos.filter(
    (p) => p.cantidad > 0 && p.cantidad <= UMBRAL_STOCK_BAJO
  ).length;

  const sinStock = productos.filter((p) => p.cantidad === 0).length;

  const handleAdjustStock = (idProducto: number, cantidadIngresada: number) => {
    ajustarStock.mutate(
      { idProducto, cantidadIngresada },
      {
        onSuccess: (productoActualizado) => {
          setSelectedProduct(productoActualizado);
          setModalOpen(false);
        },
      }
    );
  };

  // Evita el parpadeo del contenido de Stock mientras se redirige
  // (solo aplica al acceso directo por ruta, nunca al uso embebido)
  if (!embedded && !isAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Stock</h1>
        <p className="text-slate-500">Gestión de inventario</p>
      </div>

      {/* Indicador de filtro activo */}
      {activeFilter && (
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full">
            Mostrando: {activeFilter === "bajo" ? "Stock Bajo" : "Sin Stock"}
          </span>

          <button
            onClick={() => setActiveFilter(null)}
            className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors"
          >
            Quitar filtro
          </button>
        </div>
      )}

      {/* KPI Cards — Stock Bajo y Sin Stock son clickeables */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StockKpiCard
          title="Stock Bajo"
          value={String(stockBajo)}
          icon={AlertTriangle}
          onClick={() => handleFilterClick("bajo")}
          active={activeFilter === "bajo"}
        />

        <StockKpiCard
          title="Sin Stock"
          value={String(sinStock)}
          icon={XCircle}
          onClick={() => handleFilterClick("sinStock")}
          active={activeFilter === "sinStock"}
        />

        <StockKpiCard title="Productos" value={String(productos.length)} icon={Package} />

        <StockKpiCard title="Inventario" value="OK" icon={Boxes} />
      </div>

      {/* Filtro por nombre */}
      <StockHeader search={search} setSearch={setSearch} />

      {/* Tabla — reacciona al filtro activo */}
      {isLoading ? (
        <p className="text-slate-400 text-sm">Cargando inventario...</p>
      ) : (
        <StockTable
          productos={filteredProducts}
          onView={(producto) => {
            setSelectedProduct(producto);
            setModalOpen(true);
          }}
        />
      )}

      {/* Modal Ajuste Stock */}
      <FormModal
        open={modalOpen}
        title="Ajuste de Stock"
        subtitle="Actualizar inventario del producto seleccionado"
        onClose={() => setModalOpen(false)}
        showFooter={false}
      >
        <StockForm
          producto={selectedProduct}
          onAdjustStock={handleAdjustStock}
          isSubmitting={ajustarStock.isPending}
        />
      </FormModal>
    </div>
  );
}