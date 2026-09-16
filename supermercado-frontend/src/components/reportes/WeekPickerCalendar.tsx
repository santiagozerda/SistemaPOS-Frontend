"use client";

import { SemanaDelMesDTO } from "@/types/reporte";

interface Props {
  anio: number;
  mes: number;
  semanas: SemanaDelMesDTO[];
  semanaSeleccionada: number | null;
  onSelectSemana: (numero: number) => void;
  isLoading?: boolean;
}

function formatFechaCorta(iso: string) {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

export default function WeekPickerCalendar({
  semanas,
  semanaSeleccionada,
  onSelectSemana,
  isLoading = false,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      {isLoading ? (
        <p className="text-slate-400 text-sm text-center py-2">
          Cargando semanas del mes...
        </p>
      ) : semanas.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-2">
          No hay datos de semanas para este mes.
        </p>
      ) : (
        <div className="space-y-1.5">
          <label htmlFor="semana-select" className="text-xs font-semibold uppercase text-slate-500">
            Semana
          </label>

          <select
            id="semana-select"
            value={semanaSeleccionada ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val) onSelectSemana(Number(val));
            }}
            className="
              w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white
              text-sm outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            <option value="" disabled>
              Seleccioná una semana...
            </option>
            {semanas.map((s) => (
              <option key={s.numero} value={s.numero}>
                Semana {s.numero} ({formatFechaCorta(s.desde)} - {formatFechaCorta(s.hasta)})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}