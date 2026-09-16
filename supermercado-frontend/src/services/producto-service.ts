import { api } from "@/lib/api";
import { handleHttpError } from "@/lib/http-error";
import { AjustarStockDTO } from "@/types/stock";
import { CrearProductoDTO, Producto } from "@/types/producto";

export async function getProductos(): Promise<Producto[]> {
  try {
    const { data } = await api.get<Producto[]>("/productos");
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudieron cargar los productos.");
  }
}

export async function getProducto(id: number): Promise<Producto> {
  try {
    const { data } = await api.get<Producto>(`/productos/${id}`);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo cargar el producto.");
  }
}

export async function crearProducto(dto: CrearProductoDTO): Promise<Producto> {
  try {
    const { data } = await api.post<Producto>("/productos", dto);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo crear el producto.");
  }
}

export async function editarProducto(
  id: number,
  dto: CrearProductoDTO,
): Promise<Producto> {
  try {
    const { data } = await api.put<Producto>(`/productos/${id}`, dto);
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo actualizar el producto.");
  }
}

export async function eliminarProducto(id: number): Promise<void> {
  try {
    await api.delete(`/productos/${id}`);
  } catch (err) {
    return handleHttpError(
      err,
      "No se pudo eliminar el producto. Verificá que no tenga ventas asociadas.",
    );
  }
}

export async function getProductosBajoStock(): Promise<Producto[]> {
  try {
    const { data } = await api.get<Producto[]>("/productos/bajo-stock");
    return data;
  } catch (err) {
    return handleHttpError(
      err,
      "No se pudieron cargar los productos con bajo stock.",
    );
  }
}

export async function ajustarStock(dto: AjustarStockDTO): Promise<Producto> {
  try {
    const { data } = await api.patch<Producto>(
      "/productos/ajustar-stock",
      dto,
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo ajustar el stock.");
  }
}

export async function asignarPromocion(
  productoId: number,
  promocionId: number,
): Promise<Producto> {
  try {
    const { data } = await api.put<Producto>(
      `/productos/${productoId}/promo/${promocionId}`,
    );
    return data;
  } catch (err) {
    return handleHttpError(err, "No se pudo asignar la promoción.");
  }
}
