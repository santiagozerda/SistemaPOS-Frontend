import { ReactNode } from "react";

export interface ColumnaReporte<T> {
  header: string;
  render: (fila: T, index: number) => ReactNode;
  align?: "left" | "right";
}

interface Props<T> {
  columnas: ColumnaReporte<T>[];
  filas: T[];
  keyExtractor: (fila: T, index: number) => string | number;
  onRowClick?: (fila: T) => void;
  emptyMessage?: string;
}

export default function ReportTable<T>({
  columnas,
  filas,
  keyExtractor,
  onRowClick,
  emptyMessage = "Sin datos para el período seleccionado.",
}: Props<T>) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        border
        border-slate-200
        shadow-sm
        overflow-hidden
      "
    >
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {columnas.map((col) => (
              <th
                key={col.header}
                className={`p-4 ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filas.map((fila, index) => (
            <tr
              key={keyExtractor(fila, index)}
              onClick={onRowClick ? () => onRowClick(fila) : undefined}
              className={`
                border-t
                border-slate-100
                ${onRowClick ? "cursor-pointer hover:bg-slate-50 transition-colors" : ""}
              `}
            >
              {columnas.map((col) => (
                <td
                  key={col.header}
                  className={`p-4 ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.render(fila, index)}
                </td>
              ))}
            </tr>
          ))}

          {filas.length === 0 && (
            <tr>
              <td
                colSpan={columnas.length}
                className="text-center text-slate-400 text-sm py-8"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
