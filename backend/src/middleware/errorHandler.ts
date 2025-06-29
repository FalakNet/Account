import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  if (error.name === 'UnauthorizedError' || error.code === 'UNAUTHORIZED') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
      timestamp: new Date().toISOString(),
    });
  }

  if (error.name === 'ForbiddenError' || error.code === 'FORBIDDEN') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Insufficient permissions to access this resource',
      timestamp: new Date().toISOString(),
    });
  }

  // Generic error response
  res.status(statusCode).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};
