interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function StockHeader({
  search,
  setSearch,
}: Props) {
  return (
    <div className="flex justify-between mb-6">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-96
          px-4
          py-2
          border
          border-slate-300
          rounded-lg
          bg-white
        "
      />
    </div>
  );
}