import { Response } from 'express';

interface SuccessResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

interface ErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = 'تمت العملية بنجاح',
  data,
  meta,
}: SuccessResponseOptions<T>): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
    ...(meta && { meta }),
  });
};

export const sendError = ({
  res,
  statusCode = 500,
  message,
}: ErrorResponseOptions): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};