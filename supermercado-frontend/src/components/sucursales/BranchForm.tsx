"use client";

import { CrearSucursalRequest } from "@/types/sucursal";

interface BranchFormProps {
  data: CrearSucursalRequest;
  onChange: (data: CrearSucursalRequest) => void;
}

const inputClass = `
  w-full border border-slate-300 rounded-lg p-3 outline-none
  focus:ring-2 focus:ring-blue-500
`;

export default function BranchForm({ data, onChange }: BranchFormProps) {
  const handleChange = (field: keyof CrearSucursalRequest, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
            Nombre de la sucursal:
          </label>
          <input
            id="nombre"
            type="text"
            value={data.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Ej: Casa Central, Sucursal Norte..."
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="telefono" className="text-sm font-medium text-slate-700">
            Teléfono:
          </label>
          <input
            id="telefono"
            type="text"
            value={data.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            placeholder="Ej: 381 4123456"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="direccion" className="text-sm font-medium text-slate-700">
          Dirección:
        </label>
        <input
          id="direccion"
          type="text"
          value={data.direccion}
          onChange={(e) => handleChange("direccion", e.target.value)}
          placeholder="Ej: Av. Roca 123"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="localidad" className="text-sm font-medium text-slate-700">
            Localidad:
          </label>
          <input
            id="localidad"
            type="text"
            value={data.localidad}
            onChange={(e) => handleChange("localidad", e.target.value)}
            placeholder="Ej: Lastenia"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="provincia" className="text-sm font-medium text-slate-700">
            Provincia:
          </label>
          <input
            id="provincia"
            type="text"
            value={data.provincia}
            onChange={(e) => handleChange("provincia", e.target.value)}
            placeholder="Ej: Tucumán"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}