"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface FormModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  submitLabel?: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
  showFooter?: boolean;
  isSubmitting?: boolean;
}

export default function FormModal({
  open,
  title,
  subtitle,
  submitLabel = "Guardar",
  children,
  onClose,
  onSubmit,
  showFooter = true,
  isSubmitting = false,
}: FormModalProps) {

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    open,
    onClose,
    isSubmitting,
  ]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
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
        className="
          fixed
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[700px]
          max-w-[95vw]
          max-h-[90vh]
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          z-50
          flex
          flex-col
        "
      >

        <div
          className="
            flex
            justify-between
            items-start
            p-6
            border-b
            border-slate-200
            shrink-0
          "
        >
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="text-slate-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              p-2
              rounded-lg
              hover:bg-slate-100
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="
            p-6
            overflow-y-auto
            flex-1
            min-h-0
          "
        >
          {children}
        </div>

        {showFooter && (
          <div
            className="
              flex
              justify-end
              gap-3
              p-6
              border-t
              border-slate-200
              bg-slate-50
              shrink-0
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
              Cancelar
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                transition-colors
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {submitLabel}
            </button>

          </div>
        )}

      </div>
    </>
  );
}