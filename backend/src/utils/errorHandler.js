export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  // Always log the full error server-side so you can see it in terminal
  console.error(`❌ [${req.method} ${req.path}]`, err.message);
  if (err.stack) console.error(err.stack);

  // In development: send the real message regardless of operational flag
  // In production: hide internal details for non-operational errors
  const isDev = process.env.NODE_ENV !== "production";
  const message =
    isDev || err.isOperational ? err.message : "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDev && { stack: err.stack }),
  });
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);