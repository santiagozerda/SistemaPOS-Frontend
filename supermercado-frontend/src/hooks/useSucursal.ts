"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  createSucursal,
  deleteSucursal,
  getSucursal,
  getSucursales,
  updateSucursal,
} from "@/services/sucursal-service";

import { CrearSucursalRequest } from "@/types/sucursal";

export const SUCURSALES_QUERY_KEY = ["sucursales"];

export function useSucursales() {
  return useQuery({
    queryKey: SUCURSALES_QUERY_KEY,
    queryFn: getSucursales,
  });
}

export function useSucursal(id: number | null) {
  return useQuery({
    queryKey: ["sucursal", id],
    queryFn: () => getSucursal(id as number),
    enabled: id !== null,
  });
}

export function useCreateSucursal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearSucursalRequest) => createSucursal(data),
    onSuccess: () => {
      toast.success("Sucursal creada");
      queryClient.invalidateQueries({ queryKey: SUCURSALES_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSucursal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CrearSucursalRequest }) =>
      updateSucursal(id, data),
    onSuccess: (_, variables) => {
      toast.success("Sucursal actualizada");
      queryClient.invalidateQueries({ queryKey: SUCURSALES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["sucursal", variables.id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteSucursal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSucursal(id),
    onSuccess: () => {
      toast.success("Sucursal eliminada");
      queryClient.invalidateQueries({ queryKey: SUCURSALES_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
