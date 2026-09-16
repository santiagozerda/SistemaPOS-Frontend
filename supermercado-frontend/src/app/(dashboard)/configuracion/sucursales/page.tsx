"use client";

import { useCallback, useState } from "react";
import { Building2 } from "lucide-react";

import BranchForm from "@/components/sucursales/BranchForm";
import BranchCard from "@/components/sucursales/BranchCard";
import FormModal from "@/components/ui/FormModal";

import {
  useCreateSucursal,
  useDeleteSucursal,
  useSucursales,
  useUpdateSucursal,
} from "@/hooks/useSucursal";

import { CrearSucursalRequest, Sucursal } from "@/types/sucursal";

const emptyForm: CrearSucursalRequest = {
  nombre: "",
  direccion: "",
  localidad: "",
  provincia: "",
  telefono: "",
};

export default function SucursalesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [formData, setFormData] = useState<CrearSucursalRequest>(emptyForm);

  const {
    data: sucursales = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useSucursales();

  const createMutation = useCreateSucursal();
  const updateMutation = useUpdateSucursal();
  const deleteMutation = useDeleteSucursal();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleFormChange = useCallback((data: CrearSucursalRequest) => {
    setFormData(data);
  }, []);

  const openCreateModal = () => {
    setEditingSucursal(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
    setFormData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      localidad: sucursal.localidad,
      provincia: sucursal.provincia,
      telefono: sucursal.telefono,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setModalOpen(false);
    setEditingSucursal(null);
    setFormData(emptyForm);
  };

  const handleSubmit = () => {
    const nombre = formData.nombre.trim();
    const direccion = formData.direccion.trim();
    const localidad = formData.localidad.trim();
    const provincia = formData.provincia.trim();
    const telefono = formData.telefono.trim();

    if (!nombre) {
      window.alert("El nombre de la sucursal es obligatorio.");
      return;
    }

    if (!direccion) {
      window.alert("La dirección de la sucursal es obligatoria.");
      return;
    }

    if (!localidad) {
      window.alert("La localidad de la sucursal es obligatoria.");
      return;
    }

    if (!provincia) {
      window.alert("La provincia de la sucursal es obligatoria.");
      return;
    }

    if (!telefono) {
      window.alert("El teléfono de la sucursal es obligatorio.");
      return;
    }

    const data = { nombre, direccion, localidad, provincia, telefono };

    if (editingSucursal) {
      updateMutation.mutate(
        { id: editingSucursal.id, data },
        { onSuccess: () => closeModal() }
      );
      return;
    }

    createMutation.mutate(data, { onSuccess: () => closeModal() });
  };

  const handleDelete = (sucursal: Sucursal) => {
    const confirmed = window.confirm(
      `¿Está seguro que desea eliminar la sucursal "${sucursal.nombre}"?`
    );

    if (!confirmed) return;

    deleteMutation.mutate(sucursal.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div
            className="
              w-8 h-8 border-4 border-blue-600 border-t-transparent
              rounded-full animate-spin
            "
          />
          <p className="text-sm text-slate-500">Cargando sucursales...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-700 font-semibold mb-1">Error al cargar sucursales</p>
          <p className="text-red-500 text-sm mb-4">
            {error instanceof Error ? error.message : "Ocurrió un error inesperado."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm text-red-600 underline hover:text-red-800 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Sucursales</h1>
          <p className="text-slate-500">Administración de sucursales</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="
            bg-blue-600 text-white px-4 py-2 rounded-lg
            hover:bg-blue-700 transition-colors
          "
        >
          Nueva Sucursal
        </button>
      </div>

      {sucursales.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Building2 size={32} className="opacity-40" />
            <p className="text-sm font-medium">No hay sucursales registradas</p>
            <p className="text-xs">Hacé clic en "Nueva Sucursal" para agregar una.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sucursales.map((sucursal) => (
            <BranchCard
              key={sucursal.id}
              sucursal={sucursal}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <FormModal
        open={modalOpen}
        title={editingSucursal ? "Editar Sucursal" : "Nueva Sucursal"}
        subtitle={editingSucursal ? "Modificar datos de la sucursal" : "Registrar sucursal"}
        submitLabel={isSubmitting ? "Guardando..." : editingSucursal ? "Guardar cambios" : "Guardar"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <BranchForm data={formData} onChange={handleFormChange} />
      </FormModal>
    </div>
  );
}