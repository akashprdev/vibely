import { Response } from 'express';

interface SuccessOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

interface ErrorOptions {
  res: Response;
  statusCode?: number;
  message?: string;
  errors?: string | Record<string, string[]> | null;
}

export type HttpError = Error & { statusCode?: number };

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = 'Success',
  data,
}: SuccessOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

export const sendError = ({
  res,
  statusCode = 500,
  message = 'Something went wrong',
  errors = null,
}: ErrorOptions) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
