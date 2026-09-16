"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ajustarStock, getProductos } from "@/services/producto-service";
import { PRODUCTOS_QUERY_KEY } from "@/hooks/useProductos";
import { AjustarStockDTO } from "@/types/stock";

export function useStockProductos() {
  return useQuery({
    queryKey: PRODUCTOS_QUERY_KEY,
    queryFn: getProductos,
  });
}

export function useAjustarStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AjustarStockDTO) => ajustarStock(dto),
    onSuccess: () => {
      toast.success("Stock actualizado");
      queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
