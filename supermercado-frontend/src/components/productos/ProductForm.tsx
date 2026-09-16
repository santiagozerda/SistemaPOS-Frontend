"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import Switch from "@/components/ui/Switch";
import { usePromociones } from "@/hooks/usePromociones";
import { getPromotionLabel } from "@/components/promociones/promotions-types";
import { CrearProductoDTO, Producto } from "@/types/producto";

interface ProductFormProps {
  product?: Producto;
}

export interface ProductFormHandle {
  /**
   * Devuelve el DTO listo para mandar al backend, o `null` si hay
   * campos obligatorios sin completar (nombre / código de barra).
   * El componente padre (page.tsx) es quien decide qué hacer con `null`
   * — típicamente mostrar un toast de validación.
   */
  getFormData: () => CrearProductoDTO | null;
}

const CATEGORIAS = ["Bebidas", "Almacén", "Lácteos", "Limpieza"];

// El código de barra corto (6 dígitos) que usa el POS para búsqueda
// rápida se calcula del lado del backend a partir de este mismo campo,
// por eso acá se sigue pidiendo y validando el código completo.
const LARGO_MINIMO_CODIGO_BARRA = 6;

const ProductForm = forwardRef<ProductFormHandle, ProductFormProps>(
  function ProductForm({ product }, ref) {
    const [nombre, setNombre] = useState("");
    const [codigoBarra, setCodigoBarra] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState(0);
    const [cantidad, setCantidad] = useState(0);

    const [promotionEnabled, setPromotionEnabled] = useState(false);
    const [idPromo, setIdPromo] = useState<number | "">("");

    const { data: promociones = [] } = usePromociones();

    // Solo se ofrecen para asignar las promociones vigentes, y se
    // excluye el placeholder SIN_PROMOCION que usa el backend
    // internamente (ese estado ya lo maneja el Switch de acá arriba).
    const promocionesActivas = useMemo(
      () => promociones.filter((p) => p.activa && p.tipo !== "SIN_PROMOCION"),
      [promociones],
    );

    useEffect(() => {
      if (!product) {
        setNombre("");
        setCodigoBarra("");
        setCategoria("");
        setPrecio(0);
        setCantidad(0);
        setPromotionEnabled(false);
        setIdPromo("");
        return;
      }

      setNombre(product.nombre);
      setCodigoBarra(product.codigoBarra);
      setCategoria(product.categoria);
      setPrecio(product.precio);
      setCantidad(product.cantidad);

      const tienePromoReal = product.promo?.tipo !== "SIN_PROMOCION";
      setPromotionEnabled(tienePromoReal);
      setIdPromo(tienePromoReal ? product.promo.idPromocion : "");
    }, [product]);

    useImperativeHandle(ref, () => ({
      getFormData: () => {
        if (!nombre.trim()) return null;
        if (codigoBarra.trim().length < LARGO_MINIMO_CODIGO_BARRA) return null;

        return {
          nombre: nombre.trim(),
          categoria,
          precio,
          cantidad,
          codigoBarra: codigoBarra.trim(),
          idPromo: promotionEnabled && idPromo !== "" ? Number(idPromo) : null,
        };
      },
    }));

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Nombre del Producto
          </label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingrese nombre del producto"
            className="
              w-full
              border
              border-slate-300
              rounded-lg
              px-3
              py-2.5
            "
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Código de Barras
          </label>

          <input
            value={codigoBarra}
            onChange={(e) => setCodigoBarra(e.target.value)}
            placeholder="7791234567890"
            className="
              w-full
              border
              border-slate-300
              rounded-lg
              px-3
              py-2.5
            "
          />

          <p className="text-xs text-slate-400 mt-1">
            Mínimo {LARGO_MINIMO_CODIGO_BARRA} dígitos. Los últimos{" "}
            {LARGO_MINIMO_CODIGO_BARRA} se usan para la búsqueda rápida en
            Ventas y deben ser únicos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Precio
            </label>

            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="
                w-full
                border
                border-slate-300
                rounded-lg
                px-3
                py-2.5
              "
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Stock
            </label>

            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="
                w-full
                border
                border-slate-300
                rounded-lg
                px-3
                py-2.5
              "
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
            Categoría
          </label>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="
              w-full
              border
              border-slate-300
              rounded-lg
              px-3
              py-2.5
              bg-white
            "
          >
            <option value="">Seleccionar categoría</option>

            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Promoción</h3>
              <p className="text-sm text-slate-500">Asignar promoción</p>
            </div>

            <Switch
              checked={promotionEnabled}
              onChange={(value) => {
                setPromotionEnabled(value);
                if (!value) setIdPromo("");
              }}
            />
          </div>

          {promotionEnabled && (
            <div
              className="
                mt-3
                bg-blue-50
                border
                border-blue-200
                rounded-lg
                p-3
              "
            >
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Promoción Disponible
              </label>

              <select
                value={idPromo}
                onChange={(e) =>
                  setIdPromo(e.target.value ? Number(e.target.value) : "")
                }
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-3
                  py-2.5
                  bg-white
                "
              >
                <option value="">Seleccionar promoción</option>

                {promocionesActivas.map((promo) => (
                  <option key={promo.idPromocion} value={promo.idPromocion}>
                    {promo.descripcion} — {getPromotionLabel(promo.tipo)}
                  </option>
                ))}
              </select>

              {promocionesActivas.length === 0 && (
                <p className="text-xs text-slate-400 mt-2">
                  No hay promociones activas disponibles.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default ProductForm;
