"use client";

import { Pencil, Trash2 } from "lucide-react";

import { PromocionDTO } from "@/types/promocion";
import { getPromotionLabel } from "./promotions-types";

interface Props {
  promociones: PromocionDTO[];
  onEdit: (promo: PromocionDTO) => void;
  onDelete: (promo: PromocionDTO) => void;
}

export default function PromotionTable({
  promociones,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-4 text-left">Descripción</th>
            <th className="p-4 text-left">Tipo</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {promociones.map((promo) => (
            <tr key={promo.idPromocion}>
              <td className="p-4">{promo.descripcion}</td>
              <td className="p-4">{getPromotionLabel(promo.tipo)}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    promo.activa
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {promo.activa ? "Activa" : "Inactiva"}
                </span>
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(promo)}
                    className="text-slate-500 hover:text-blue-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(promo)}
                    className="text-slate-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {promociones.length === 0 && (
        <p className="text-center text-slate-400 py-8 text-sm">
          No hay promociones cargadas.
        </p>
      )}
    </div>
  );
}