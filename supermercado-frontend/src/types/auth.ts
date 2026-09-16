export type UserRole = "ADMINISTRADOR" | "CAJERO";

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  role: UserRole;
}

// Lo que tipea el usuario en el form de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Forma cruda que devuelve el backend (LoginResponseDTO)
export interface LoginResponseDTO {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: UserRole;
}