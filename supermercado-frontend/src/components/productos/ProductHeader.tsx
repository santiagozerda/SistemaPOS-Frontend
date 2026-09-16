interface ProductHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  onCreate: () => void;
}

export default function ProductHeader({
  search,
  setSearch,
  onCreate,
}: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <input
        type="text"
        placeholder="Buscar por nombre o código de barras..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        // autoFocus ayuda a la ergonomía con lector de código de barras:
        // el lector solo "escribe" en el input que tiene foco. Si el
        // catálogo se abre y se usa el lector de entrada, conviene que
        // el cursor ya esté acá sin que el admin tenga que clickear.
        autoFocus
        className="
          w-96
          px-4
          py-2
          rounded-lg
          border
          border-slate-300
          bg-white
        "
      />

      <button
        onClick={onCreate}
        className="
          bg-blue-600
          text-white
          px-4
          py-2
          rounded-lg
          hover:bg-blue-700
          transition
        "
      >
        Nuevo Producto
      </button>
    </div>
  );
}
