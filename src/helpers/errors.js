//src/errors.js

export function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
createError()
//Helper para crear errores personalizados con status code y mensaje
export const BadRequestError = (message) => createError(400, message || 'Solicitud incorrecta');
export const NotFoundError = (message) => createError(404, message || 'No encontrado');
export const InternalServerError = (message) => createError(500, message || 'Error interno del servidor');

