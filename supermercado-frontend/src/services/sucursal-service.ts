import { api } from "@/lib/api";
import { handleHttpError } from "@/lib/http-error";
import { CrearSucursalRequest, Sucursal } from "@/types/sucursal";

const BASE_URL = "/sucursal";

export async function getSucursales(): Promise<Sucursal[]> {
  try {
    const { data } = await api.get<Sucursal[]>(BASE_URL);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudieron cargar las sucursales.");
  }
}

export async function getSucursal(id: number): Promise<Sucursal> {
  try {
    const { data } = await api.get<Sucursal>(`${BASE_URL}/${id}`);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cargar la sucursal.");
  }
}

export async function createSucursal(
  data: CrearSucursalRequest
): Promise<Sucursal> {
  try {
    const { data: response } = await api.post<Sucursal>(BASE_URL, data);
    return response;
  } catch (err) {
    return handleHttpError(err, "No se pudo crear la sucursal.");
  }
}

export async function updateSucursal(
  id: number,
  data: CrearSucursalRequest
): Promise<Sucursal> {
  try {
    const { data: response } = await api.put<Sucursal>(
      `${BASE_URL}/${id}`,
      data
    );
    return response;
  } catch (err) {
    return handleHttpError(err, "No se pudo actualizar la sucursal.");
  }
}

export async function deleteSucursal(id: number): Promise<void> {
  try {
    await api.delete(`${BASE_URL}/${id}`);
  } catch (err) {
    return handleHttpError(err, "No se pudo eliminar la sucursal.");
  }
}
