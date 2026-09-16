import { api } from "@/lib/api";
import { handleHttpError } from "@/lib/http-error";
import { TicketDTO } from "@/types/ticket";

export async function findTicket(idTicket: number): Promise<TicketDTO> {
  try {
    const { data } = await api.get<TicketDTO>(`/ticket/${idTicket}`);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cargar el ticket.");
  }
}

export async function findByNumeroTicket(
  numeroTicket: string
): Promise<TicketDTO> {
  try {
    const { data } = await api.get<TicketDTO>(
      `/ticket/numero/${numeroTicket}`
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se encontró ningún ticket con ese número.");
  }
}

// Fallback para Transferencia: PagoResponseDTO.ticket solo viene
// poblado en el camino de Efectivo (ver B.8). Para Transferencia, una
// vez que el polling detecta estadoPago=APROBADO, se usa esto.
export async function findTicketByVenta(idVenta: number): Promise<TicketDTO> {
  try {
    const { data } = await api.get<TicketDTO>(`/ticket/venta/${idVenta}`);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo obtener el ticket de la venta.");
  }
}
