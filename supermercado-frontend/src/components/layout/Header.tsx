"use client";

import OptionsMenu from "./OptionsMenu";

export default function Header() {
  return (
    <header
      className="
      h-16
      bg-white
      border-b
      border-slate-200
      px-6
      flex
      items-center
      justify-between
      shadow-sm
    "
    >
      <div>
        <h2 className="font-bold text-lg">
          Eben Ezer - Drugstore
        </h2>

        <p className="text-xs text-slate-500">
          Sistema de Gestión ERP
        </p>
      </div>

      <OptionsMenu />
    </header>
  );
}