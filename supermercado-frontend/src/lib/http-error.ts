import { isAxiosError } from "axios";

// Refleja 1:1 el record ErrorResponse del GlobalExceptionHandler:
//   record ErrorResponse(LocalDateTime timestamp, int status, String error, String message)
// Jackson serializa los nombres de los parámetros del record tal cual,
// así que el JSON queda: { timestamp, status, error, message }.
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string; // código corto: "PRODUCTO_ERROR", "STOCK_INSUFICIENTE", "PROMOCION_ERROR", etc.
  message: string; // el mensaje legible (ex.getMessage() de la excepción original)
}

function esErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as ErrorResponse).message === "string"
  );
}

/**
 * Extrae el mensaje real que arma GlobalExceptionHandler (campo
 * `message` del ErrorResponse). Si por algún motivo el backend no
 * devuelve ese shape (timeout, error de red, 500 sin cuerpo, etc.),
 * cae al mensaje por defecto que le pasa cada service.
 */
export function extraerMensajeError(
  err: unknown,
  mensajeDefault: string
): string {
  if (isAxiosError(err) && esErrorResponse(err.response?.data)) {
    return err.response!.data.message;
  }

  return mensajeDefault;
}

/**
 * Devuelve el código corto del error ("PRODUCTO_ERROR", "STOCK_INSUFICIENTE",
 * etc.) para uso futuro (ej. distinguir el ícono/color del toast según
 * el tipo de error). No se usa todavía en ningún lado.
 */
export function extraerCodigoError(err: unknown): string | null {
  if (isAxiosError(err) && esErrorResponse(err.response?.data)) {
    return err.response!.data.error;
  }

  return null;
}

/**
 * Envuelve extraerMensajeError y directamente lanza el Error, para usar
 * en un catch de una sola línea: `catch (err) { return handleHttpError(err, "..."); }`
 */
export function handleHttpError(err: unknown, mensajeDefault: string): never {
  throw new Error(extraerMensajeError(err, mensajeDefault));
}
