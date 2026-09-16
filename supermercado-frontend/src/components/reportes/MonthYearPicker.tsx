interface Props {
  anio: number;
  mes: number;
  onChange: (anio: number, mes: number) => void;
}

export default function MonthYearPicker({ anio, mes, onChange }: Props) {
  const value = `${anio}-${String(mes).padStart(2, "0")}`;

  return (
    <input
      type="month"
      value={value}
      onChange={(e) => {
        if (!e.target.value) return;
        const [y, m] = e.target.value.split("-").map(Number);
        if (y && m) onChange(y, m);
      }}
      className="
        border
        border-slate-300
        rounded-lg
        px-3
        py-2
        bg-white
        text-sm
      "
    />
  );
}