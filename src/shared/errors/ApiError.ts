export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'غير مصرح'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'ممنوع الوصول'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'غير موجود'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  static internal(message = 'خطأ في السيرفر'): ApiError {
    return new ApiError(500, message, false);
  }
}