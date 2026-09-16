import { api } from "@/lib/api";
import { handleHttpError } from "@/lib/http-error";
import {
  ProductoMasVendidoDTO,
  ReporteVentaDTO,
  SemanaDelMesDTO,
  VentaDiaDTO,
  VentaMesDTO,
  VentaSemanaDTO,
} from "@/types/reporte";

export async function getReporteDia(): Promise<ReporteVentaDTO<VentaDiaDTO>> {
  try {
    const { data } = await api.get<ReporteVentaDTO<VentaDiaDTO>>(
      "/reporte/dia"
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cargar el reporte del día.");
  }
}

export async function getReporteSemana(
  anio: number,
  mes: number,
  semana: number
): Promise<ReporteVentaDTO<VentaSemanaDTO>> {
  try {
    const { data } = await api.get<ReporteVentaDTO<VentaSemanaDTO>>(
      "/reporte/semana",
      { params: { anio, mes, semana } }
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cargar el reporte de la semana.");
  }
}

export async function getReporteMes(
  anio: number,
  mes: number
): Promise<ReporteVentaDTO<VentaMesDTO>> {
  try {
    const { data } = await api.get<ReporteVentaDTO<VentaMesDTO>>(
      "/reporte/mes",
      { params: { anio, mes } }
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cargar el reporte del mes.");
  }
}

export async function getProductosMasVendidos(): Promise<
  ProductoMasVendidoDTO[]
> {
  try {
    const { data } = await api.get<ProductoMasVendidoDTO[]>(
      "/reporte/productos-mas-vendidos"
    );
    return data;
  } catch (err) {
    return handleHttpError(
      err,
      "No se pudieron cargar los productos más vendidos."
    );
  }
}

// ⚠️ Pendiente de que el backend lo implemente (ver TXT de pendientes).
export async function getSemanasDelMes(
  anio: number,
  mes: number
): Promise<SemanaDelMesDTO[]> {
  try {
    const { data } = await api.get<SemanaDelMesDTO[]>(
      "/reporte/semanas-del-mes",
      { params: { anio, mes } }
    );
    return data;
  } catch (err) {
    return handleHttpError(
      err,
      "No se pudieron cargar las semanas del mes."
    );
  }
}