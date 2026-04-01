import { Response } from 'express';

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: ValidationErrorItem[]
) {
  return res.status(statusCode).json({
    message,
    ...(errors && { errors })
  });
}
