interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Switch({
  checked,
  onChange,
}: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        relative
        inline-flex
        h-7
        w-14
        items-center
        rounded-full
        transition-all
        ${checked ? "bg-blue-600" : "bg-slate-300"}
      `}
    >
      <span
        className={`
          inline-block
          h-5
          w-5
          transform
          rounded-full
          bg-white
          transition-all
          ${checked ? "translate-x-8" : "translate-x-1"}
        `}
      />
    </button>
  );
}