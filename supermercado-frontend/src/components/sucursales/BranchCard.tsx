"use client";

import { Building2, MapPin, Phone, Pencil, Trash2 } from "lucide-react";
import { Sucursal } from "@/types/sucursal";

interface BranchCardProps {
  sucursal: Sucursal;
  onEdit: (sucursal: Sucursal) => void;
  onDelete: (sucursal: Sucursal) => void;
}

export default function BranchCard({ sucursal, onEdit, onDelete }: BranchCardProps) {
  return (
    <div
      className="
        bg-white rounded-xl border border-slate-200 p-5
        hover:border-slate-300 hover:shadow-sm transition-all
        flex flex-col gap-4
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 leading-tight">{sucursal.nombre}</p>
            <p className="text-xs text-slate-400">{sucursal.localidad} - {sucursal.provincia}</p>
          </div>
        </div>

        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(sucursal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Editar sucursal"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(sucursal)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Eliminar sucursal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-slate-600 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-slate-400 shrink-0" />
          <span>{sucursal.direccion}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-400 shrink-0" />
          <span>{sucursal.telefono || "Sin teléfono"}</span>
        </div>
      </div>
    </div>
  );
}