export type TipoPromocion =
  | "DOS_POR_UNO"
  | "TRES_POR_DOS"
  | "SEGUNDA_UNIDAD_50"
  | "SIN_PROMOCION";

export interface PromocionDTO {
  idPromocion: number;
  descripcion: string;
  tipo: TipoPromocion;
  activa: boolean;
}

export interface CrearPromocionDTO {
  descripcion: string;
  tipo: TipoPromocion;
  activa: boolean;
}