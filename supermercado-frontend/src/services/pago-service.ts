import { api } from "@/lib/api";
import { handleHttpError } from "@/lib/http-error";
import {
  PagoRequestDTO,
  PagoResponseDTO,
  PagoTransferenciaRequestDTO,
  QRResponseDTO,
} from "@/types/pago";

// Exclusivo EFECTIVO. Nunca llamar con metodoPago=TRANSFERENCIA — ver
// registrarQR más abajo para ese camino.
export async function registrarPago(
  dto: PagoRequestDTO
): Promise<PagoResponseDTO> {
  try {
    const { data } = await api.post<PagoResponseDTO>("/pagos", dto);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo registrar el pago.");
  }
}

// Exclusivo TRANSFERENCIA — genera la preferencia real en MercadoPago.
export async function generarQR(
  dto: PagoTransferenciaRequestDTO
): Promise<QRResponseDTO> {
  try {
    const { data } = await api.post<QRResponseDTO>(
      "/pagos/transferencia",
      dto
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo generar el QR de pago.");
  }
}

// Mismo endpoint sirve para polling (repetir la llamada) y para el
// detalle final — siempre devuelve el DTO completo.
export async function getPagoDeVenta(
  ventaId: number
): Promise<PagoResponseDTO> {
  try {
    const { data } = await api.get<PagoResponseDTO>(
      `/pagos/venta/${ventaId}`
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo consultar el estado del pago.");
  }
}
