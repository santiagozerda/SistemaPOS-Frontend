export type ReportePeriodo = "dia" | "semana" | "mes";

interface Props {
  active: ReportePeriodo;
  onChange: (tab: ReportePeriodo) => void;
}

const TABS: { value: ReportePeriodo; label: string }[] = [
  { value: "dia", label: "Día" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
];

export default function ReportTabs({ active, onChange }: Props) {
  return (
    <div className="inline-flex bg-slate-100 rounded-xl p-1 gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            px-4
            py-2
            rounded-lg
            text-sm
            font-medium
            transition-colors
            ${
              active === tab.value
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
