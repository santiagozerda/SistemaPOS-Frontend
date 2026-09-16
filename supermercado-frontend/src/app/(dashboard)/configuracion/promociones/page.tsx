"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import PromotionTable from "@/components/promociones/PromotionTable";
import PromotionForm from "@/components/promociones/PromotionForm";
import FormModal from "@/components/ui/FormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  usePromociones,
  useCrearPromocion,
  useEditarPromocion,
  useEliminarPromocion,
} from "@/hooks/usePromociones";
import { CrearPromocionDTO, PromocionDTO } from "@/types/promocion";

const EMPTY_FORM: CrearPromocionDTO = {
  descripcion: "",
  tipo: "DOS_POR_UNO",
  activa: true,
};

export default function PromocionesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<CrearPromocionDTO>(EMPTY_FORM);
  const [promoToDelete, setPromoToDelete] = useState<PromocionDTO | null>(null);

  const { data: promociones = [], isLoading } = usePromociones();
  const crearPromocion = useCrearPromocion();
  const editarPromocion = useEditarPromocion();
  const eliminarPromocion = useEliminarPromocion();

  const openCreate = () => {
    setEditingId(null);
    setFormValue(EMPTY_FORM);
    setDrawerOpen(true);
  };

  const openEdit = (promo: PromocionDTO) => {
    setEditingId(promo.idPromocion);
    setFormValue({
      descripcion: promo.descripcion,
      tipo: promo.tipo,
      activa: promo.activa,
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formValue.descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return;
    }

    if (editingId !== null) {
      editarPromocion.mutate(
        { id: editingId, dto: formValue },
        { onSuccess: closeDrawer },
      );
    } else {
      crearPromocion.mutate(formValue, { onSuccess: closeDrawer });
    }
  };

  const handleDeleteConfirm = () => {
    if (!promoToDelete) return;

    eliminarPromocion.mutate(promoToDelete.idPromocion, {
      onSuccess: () => setPromoToDelete(null),
    });
  };

  const isSubmitting = crearPromocion.isPending || editarPromocion.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Promociones</h1>
          <p className="text-slate-500">Administración de promociones</p>
        </div>

        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Nueva Promoción
        </button>
      </div>

      <FormModal
        open={drawerOpen}
        title={editingId !== null ? "Editar Promoción" : "Nueva Promoción"}
        subtitle="Crear promoción comercial"
        submitLabel={
          editingId !== null ? "Guardar Cambios" : "Guardar Promoción"
        }
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <PromotionForm value={formValue} onChange={setFormValue} />
      </FormModal>

      {isLoading ? (
        <p className="text-slate-400 text-sm">Cargando promociones...</p>
      ) : (
        <PromotionTable
          promociones={promociones}
          onEdit={openEdit}
          onDelete={setPromoToDelete}
        />
      )}

      {/* Antes: window.confirm(...) crudo. Ahora usa el mismo
          ConfirmDialog reutilizable que Productos. */}
      <ConfirmDialog
        open={promoToDelete !== null}
        title={`¿Eliminar la promoción "${promoToDelete?.descripcion}"?`}
        description="Si hay productos con esta promoción asignada, el backend puede rechazar la eliminación."
        confirmLabel="Eliminar"
        variant="danger"
        isConfirming={eliminarPromocion.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPromoToDelete(null)}
      />
    </div>
  );
}
