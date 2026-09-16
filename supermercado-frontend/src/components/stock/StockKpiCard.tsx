import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
  // Opcionales: solo las cards "Stock Bajo" y "Sin Stock" los reciben
  onClick?: () => void;
  active?: boolean;
}

export default function StockKpiCard({
  title,
  value,
  icon: Icon,
  onClick,
  active = false,
}: Props) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`
        border
        rounded-xl
        p-5
        transition-all
        duration-200
        ${isClickable
          ? "cursor-pointer hover:shadow-md select-none"
          : ""}
        ${active
          ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-400"
          : "bg-white border-slate-200"}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`
              text-sm
              ${active ? "text-blue-600 font-medium" : "text-slate-500"}
            `}
          >
            {title}
          </p>

          <h3
            className={`
              text-2xl
              font-bold
              mt-2
              ${active ? "text-blue-700" : ""}
            `}
          >
            {value}
          </h3>

          {/* Indicador de filtro activo */}
          {isClickable && (
            <p className="text-xs mt-1.5 text-slate-400">
              {active
                ? "✓ Filtro activo — click para quitar"
                : "Click para filtrar tabla"}
            </p>
          )}
        </div>

        <Icon
          className={active ? "text-blue-600" : "text-blue-600"}
          size={24}
        />
      </div>
    </div>
  );
}