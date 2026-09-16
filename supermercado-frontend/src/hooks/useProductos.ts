"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  crearProducto,
  editarProducto,
  eliminarProducto,
  getProductos,
} from "@/services/producto-service";
import { CrearProductoDTO } from "@/types/producto";

export const PRODUCTOS_QUERY_KEY = ["productos"] as const;

export function useProductos() {
  return useQuery({
    queryKey: PRODUCTOS_QUERY_KEY,
    queryFn: getProductos,
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CrearProductoDTO) => crearProducto(dto),
    onSuccess: () => {
      toast.success("Producto creado");
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useEditarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CrearProductoDTO }) =>
      editarProducto(id, dto),
    onSuccess: () => {
      toast.success("Producto actualizado");
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarProducto(id),
    onSuccess: () => {
      toast.success("Producto eliminado");
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}