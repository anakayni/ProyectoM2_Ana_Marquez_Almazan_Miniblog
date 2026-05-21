// src/middlewares/errorHandler.js

export function errorHandler(err, req, res, next) {
  console.error('Error capturado:', err.stack);
  const statusCode = err.statusCode || 500;
  const response = {
    error: err.message || 'Error interno del servidor',
  };
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
}