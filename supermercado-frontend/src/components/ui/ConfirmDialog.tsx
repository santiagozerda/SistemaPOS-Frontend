"use client";

import { useEffect } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" para acciones destructivas (eliminar). "default" para confirmaciones neutras. */
  variant?: "danger" | "default";
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onCancel, isConfirming]);

  if (!open) {
    return null;
  }

  const isDanger = variant === "danger";
  const Icon = isDanger ? AlertTriangle : HelpCircle;

  return (
    <>
      <div
        onClick={() => {
          if (!isConfirming) onCancel();
        }}
        className="
          fixed
          inset-0
          bg-black/50
          backdrop-blur-sm
          z-40
        "
      />

      <div
        role="alertdialog"
        aria-modal="true"
        className="
          fixed
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[440px]
          max-w-[92vw]
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          z-50
        "
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`
                shrink-0
                p-3
                rounded-xl
                ${isDanger ? "bg-red-100" : "bg-blue-100"}
              `}
            >
              <Icon
                size={22}
                className={isDanger ? "text-red-600" : "text-blue-600"}
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>

              {description && (
                <p className="text-sm text-slate-500 mt-1.5">{description}</p>
              )}
            </div>
          </div>
        </div>

        <div
          className="
            flex
            justify-end
            gap-3
            px-6
            py-4
            border-t
            border-slate-200
            bg-slate-50
          "
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="
              px-5
              py-2.5
              rounded-xl
              border
              border-slate-300
              bg-white
              hover:bg-slate-100
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`
              px-5
              py-2.5
              rounded-xl
              text-white
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
              ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {isConfirming ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
