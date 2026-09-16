"use client";

import Switch from "@/components/ui/Switch";
import { promotionTypes } from "./promotions-types";
import { CrearPromocionDTO } from "@/types/promocion";

interface Props {
  value: CrearPromocionDTO;
  onChange: (value: CrearPromocionDTO) => void;
}

export default function PromotionForm({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Descripción de la promoción:
        </label>
        <input
          value={value.descripcion}
          onChange={(e) =>
            onChange({ ...value, descripcion: e.target.value })
          }
          placeholder="Ej: Promo Verano, 2x1 Bebidas..."
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Tipo de promoción:
        </label>
        <select
          value={value.tipo}
          onChange={(e) =>
            onChange({
              ...value,
              tipo: e.target.value as CrearPromocionDTO["tipo"],
            })
          }
          className="w-full border rounded-lg p-3"
        >
          {promotionTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between border rounded-lg p-3">
        <div>
          <p className="text-sm font-medium text-slate-700">
            Promoción activa
          </p>
          <p className="text-xs text-slate-500">
            Solo las promociones activas se aplican en ventas.
          </p>
        </div>

        <Switch
          checked={value.activa}
          onChange={(activa) => onChange({ ...value, activa })}
        />
      </div>
    </div>
  );
}