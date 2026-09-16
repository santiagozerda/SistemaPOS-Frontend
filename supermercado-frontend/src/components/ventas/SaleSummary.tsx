interface Props {
  total: number | null;
  isLoading: boolean;
  isError: boolean;
  disabled: boolean;
  onCheckout: () => void;
}

export default function SaleSummary({
  total,
  isLoading,
  isError,
  disabled,
  onCheckout,
}: Props) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-slate-500 text-sm">Total</span>
        <span
          className={`text-2xl font-bold ${isError ? "text-red-500" : "text-slate-900"}`}
        >
          {isLoading
            ? "…"
            : isError
              ? "Error"
              : total !== null
                ? `$${total.toLocaleString()}`
                : "$0"}
        </span>
      </div>

      {isError ? (
        <p className="text-xs text-red-500 mb-4">
          No se pudo calcular el total. Revisá la conexión con el servidor e
          intentá de nuevo.
        </p>
      ) : (
        <p className="text-xs text-slate-400 mb-4">
          Calculado por el sistema, incluye promociones aplicadas.
        </p>
      )}

      <button
        onClick={onCheckout}
        disabled={disabled || isLoading || isError}
        className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          py-3
          rounded-xl
          font-medium
          transition-colors
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        Cobrar
      </button>
    </div>
  );
}
