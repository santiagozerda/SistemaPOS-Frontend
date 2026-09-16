"use client";

import { useState } from "react";

import {
  ChevronDown,
  LogOut,
  UserCog,
  Shield,
  ShoppingCart,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function OptionsMenu() {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-xl
          border
          border-slate-200
          hover:bg-slate-50
        "
      >
        {user.role === "ADMINISTRADOR" ? (
          <Shield size={18} />
        ) : (
          <ShoppingCart size={18} />
        )}

        {user.role === "ADMINISTRADOR" ? "Administrador" : "Cajero"}

        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-14
            bg-white
            rounded-xl
            border
            border-slate-200
            shadow-xl
            w-72
            overflow-hidden
            z-50
          "
        >
          <div className="px-4 py-3 border-b">
            <p className="font-semibold">{user.nombre}</p>
            <p className="text-sm text-slate-500">{user.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              hover:bg-slate-50
            "
          >
            <UserCog size={18} />
            Cambiar Usuario
          </button>

          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              hover:bg-red-50
              text-red-600
            "
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}