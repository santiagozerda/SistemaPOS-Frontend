interface SaleSearchProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function SaleSearch({ search, setSearch }: SaleSearchProps) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre o escanear código de barra..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
        w-full
        border
        border-slate-300
        rounded-lg
        px-4
        py-3
        bg-white
      "
    />
  );
}
