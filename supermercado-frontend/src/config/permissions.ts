import { UserRole } from "@/types/auth";

export const rolePermissions = {
  dashboard: {
    salesCard: ["ADMINISTRADOR"] as UserRole[],
    productsCard: ["ADMINISTRADOR"] as UserRole[],
  },

  configuration: [
    "ADMINISTRADOR",
  ] as UserRole[],
};