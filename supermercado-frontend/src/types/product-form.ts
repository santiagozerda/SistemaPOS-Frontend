export interface ProductFormData {
  nombre: string;
  codigoBarra: string;
  categoria: string;
  precio: number;
  cantidad: number;
  idPromo: number | null;
}