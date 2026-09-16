"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  crearPromocion,
  editarPromocion,
  eliminarPromocion,
  getPromociones,
} from "@/services/promocion-service";
import { CrearPromocionDTO } from "@/types/promocion";

export const PROMOCIONES_QUERY_KEY = ["promociones"] as const;

export function usePromociones() {
  return useQuery({
    queryKey: PROMOCIONES_QUERY_KEY,
    queryFn: getPromociones,
  });
}

export function useCrearPromocion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CrearPromocionDTO) => crearPromocion(dto),
    onSuccess: () => {
      toast.success("Promoción creada");
      queryClient.invalidateQueries({ queryKey: PROMOCIONES_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useEditarPromocion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CrearPromocionDTO }) =>
      editarPromocion(id, dto),
    onSuccess: () => {
      toast.success("Promoción actualizada");
      queryClient.invalidateQueries({ queryKey: PROMOCIONES_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useEliminarPromocion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarPromocion(id),
    onSuccess: () => {
      toast.success("Promoción eliminada");
      queryClient.invalidateQueries({ queryKey: PROMOCIONES_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
