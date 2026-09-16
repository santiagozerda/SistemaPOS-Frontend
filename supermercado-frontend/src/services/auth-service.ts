import { isAxiosError } from "axios";

import { api } from "@/lib/api";
import { AuthUser, LoginCredentials, LoginResponseDTO } from "@/types/auth";

function mapUser(dto: LoginResponseDTO): AuthUser {
  return {
    id: dto.idUsuario,
    nombre: dto.nombre,
    email: dto.email,
    role: dto.rol,
  };
}

export async function loginRequest(
  credentials: LoginCredentials
): Promise<AuthUser> {
  try {
    const { data } = await api.post<LoginResponseDTO>(
      "/auth/login",
      credentials
    );
    return mapUser(data);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 401) {
      throw new Error("Usuario o contraseña incorrectos");
    }
    throw new Error("No se pudo iniciar sesión. Intentá nuevamente.");
  }
}

// Usado por (dashboard)/layout.tsx para validar la sesión vía la cookie
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<LoginResponseDTO>("/auth/me");
    return mapUser(data);
  } catch {
    return null;
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // best-effort: si falla igual limpiamos la cookie del lado del cliente al redirigir
  }
}