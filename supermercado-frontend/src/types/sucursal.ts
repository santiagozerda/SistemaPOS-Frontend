export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  localidad:string;
  provincia:string;
  telefono:string;
}

export interface CrearSucursalRequest {
  nombre: string;
  direccion: string;
  localidad:string;
  provincia:string;
  telefono:string;
}