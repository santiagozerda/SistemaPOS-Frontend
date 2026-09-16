import { api } from "@/lib/api";
import { handleHttpError } from "@/lib/http-error";
import {
  CrearVentaRequestDTO,
  Venta,
  VentaPreviewRequestDTO,
  VentaPreviewDTO,
  VentaResumenDTO,
} from "@/types/venta";

export async function getVentas(): Promise<VentaResumenDTO[]> {
  try {
    const { data } = await api.get<VentaResumenDTO[]>("/venta");
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudieron cargar las ventas.");
  }
}

export async function findVenta(idVenta: number): Promise<Venta> {
  try {
    const { data } = await api.get<Venta>(`/venta/${idVenta}`);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cargar la venta.");
  }
}

export async function crearVenta(dto: CrearVentaRequestDTO): Promise<Venta> {
  try {
    const { data } = await api.post<Venta>("/venta", dto);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo crear la venta.");
  }
}

// Cajero — solo ventas en PENDIENTE (abandonar el checkout antes de pagar)
export async function cancelarVenta(idVenta: number): Promise<Venta> {
  try {
    const { data } = await api.patch<Venta>(`/venta/cancelar/${idVenta}`);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cancelar la venta.");
  }
}

// Administrador — solo ventas APROBADAS con pago APROBADO
export async function anularVenta(idVenta: number): Promise<Venta> {
  try {
    const { data } = await api.patch<Venta>(`/venta/anular/${idVenta}`);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo anular la venta.");
  }
}

// Preview sin persistir — usa el backend como única fuente de verdad
// para el cálculo de promociones (2x1, 3x2, 2da unidad 50%).
export async function previewVenta(
  dto: VentaPreviewRequestDTO
): Promise<VentaPreviewDTO> {
  try {
    const { data } = await api.post<VentaPreviewDTO>(
      "/venta/preview",
      dto
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo calcular el total de la venta.");
  }
}
