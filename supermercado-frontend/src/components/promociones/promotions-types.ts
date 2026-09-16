export const promotionTypes = [
  {
    value: "DOS_POR_UNO",
    label: "Dos por Uno (2x1)",
    descripcion: "Por cada dos unidades compradas, el cliente paga una.",
  },
  {
    value: "TRES_POR_DOS",
    label: "Tres por Dos (3x2)",
    descripcion: "Por cada tres unidades compradas, el cliente paga dos.",
  },
  {
    value: "SEGUNDA_UNIDAD_50",
    label: "Segunda Unidad al 50%",
    descripcion: "La segunda unidad obtiene un 50% de descuento.",
  },
  // El backend asigna este placeholder a todo producto sin promoción
  // real (nunca devuelve promo: null). Sin esta entrada, getPromotionLabel
  // mostraría el string crudo "SIN_PROMOCION" en vez de un texto legible.
  {
    value: "SIN_PROMOCION",
    label: "Sin promoción",
    descripcion: "El producto no tiene ninguna promoción asignada.",
  },
];

export function getPromotionLabel(tipo: string): string {
  return promotionTypes.find((t) => t.value === tipo)?.label ?? tipo;
}
