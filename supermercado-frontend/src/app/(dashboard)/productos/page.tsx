"use client";

import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import ProductHeader from "@/components/productos/ProductHeader";
import ProductTable from "@/components/productos/ProductTable";
import FormModal from "@/components/ui/FormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProductForm, {
  ProductFormHandle,
} from "@/components/productos/ProductForm";
import StockPage from "@/app/(dashboard)/stock/page"; // CR-01

import { Producto } from "@/types/producto";
import { useAuth } from "@/hooks/useAuth";
import {
  useProductos,
  useCrearProducto,
  useEditarProducto,
  useEliminarProducto,
} from "@/hooks/useProductos";
import { filtrarProductosPorBusqueda } from "@/lib/productSearch";

export default function ProductosPage() {
  const { user } = useAuth();
  // Antes comparaba contra "ADMIN", que no existe en UserRole
  // ("ADMINISTRADOR" | "CAJERO") — por eso nunca iba a entrar acá.
  const isAdmin = user.role === "ADMINISTRADOR";

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);

  const formRef = useRef<ProductFormHandle>(null);

  const { data: productos = [], isLoading } = useProductos();
  const crearProducto = useCrearProducto();
  const editarProducto = useEditarProducto();
  const eliminarProducto = useEliminarProducto();

  // TKT-03: búsqueda por nombre O código de barras (compatible con
  // lectores de código de barras que tipean el código completo de
  // una sola vez). Misma lógica compartida que usa Ventas/Cajero.
  const filteredProducts = useMemo(
    () => filtrarProductosPorBusqueda(productos, search),
    [productos, search],
  );

  const handleEdit = (producto: Producto) => {
    setSelectedProduct(producto);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  const validarYObtenerDTO = () => {
    const dto = formRef.current?.getFormData();
    if (!dto) {
      toast.error(
        "Completá el nombre y un código de barra válido (mínimo 6 dígitos).",
      );
      return null;
    }
    return dto;
  };

  const handleCreateSubmit = () => {
    const dto = validarYObtenerDTO();
    if (!dto) return;

    crearProducto.mutate(dto, {
      onSuccess: () => setCreateModalOpen(false),
    });
  };

  const handleEditSubmit = () => {
    if (!selectedProduct) return;

    const dto = validarYObtenerDTO();
    if (!dto) return;

    editarProducto.mutate(
      { id: selectedProduct.id, dto },
      { onSuccess: handleCloseDrawer },
    );
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;

    eliminarProducto.mutate(productToDelete.id, {
      onSuccess: () => setProductToDelete(null),
    });
  };

  // ── CR-01: el Cajero visualiza el contenido completo de "Stock"
  //           (KPI cards + buscador + tabla + modal de Ajuste) en "Producto" ──
  if (!isAdmin) {
    return <StockPage embedded />;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold">Productos</h1>

        <p className="text-slate-500 mt-1">Gestión del catálogo de productos</p>
      </div>

      {/* Buscador + Botón Crear */}
      <ProductHeader
        search={search}
        setSearch={setSearch}
        onCreate={() => setCreateModalOpen(true)}
      />

      {/* Tabla de productos */}
      {isLoading ? (
        <p className="text-slate-400 text-sm">Cargando productos...</p>
      ) : (
        <ProductTable
          productos={filteredProducts}
          onEdit={handleEdit}
          onDelete={setProductToDelete}
        />
      )}

      {/* Modal: Nuevo Producto */}
      <FormModal
        open={createModalOpen}
        title="Nuevo Producto"
        subtitle="Complete los datos del producto"
        submitLabel="Crear Producto"
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={crearProducto.isPending}
      >
        <ProductForm ref={formRef} />
      </FormModal>

      {/* Modal: Editar Producto */}
      <FormModal
        open={drawerOpen}
        title="Editar Producto"
        subtitle="Modifique la información"
        submitLabel="Guardar Cambios"
        onClose={handleCloseDrawer}
        onSubmit={handleEditSubmit}
        isSubmitting={editarProducto.isPending}
      >
        <ProductForm ref={formRef} product={selectedProduct || undefined} />
      </FormModal>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={productToDelete !== null}
        title={`¿Eliminar "${productToDelete?.nombre}"?`}
        description="Esta acción no se puede deshacer. Si el producto tiene ventas registradas, el backend va a rechazar la eliminación."
        confirmLabel="Eliminar"
        variant="danger"
        isConfirming={eliminarProducto.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
