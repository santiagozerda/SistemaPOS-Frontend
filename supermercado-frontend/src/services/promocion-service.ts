import { api } from "@/lib/api";
import { CrearPromocionDTO, PromocionDTO } from "@/types/promocion";

export async function getPromociones(): Promise<PromocionDTO[]> {
  const { data } = await api.get<PromocionDTO[]>("/promo");
  return data;
}

export async function crearPromocion(
  dto: CrearPromocionDTO
): Promise<PromocionDTO> {
  const { data } = await api.post<PromocionDTO>("/promo", dto);
  return data;
}

export async function editarPromocion(
  id: number,
  dto: CrearPromocionDTO
): Promise<PromocionDTO> {
  const { data } = await api.put<PromocionDTO>(`/promo/${id}`, dto);
  return data;
}

export async function eliminarPromocion(id: number): Promise<void> {
  await api.delete(`/promo/${id}`);
}