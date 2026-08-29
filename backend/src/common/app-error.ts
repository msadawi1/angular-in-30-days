import { HttpException, HttpStatus } from '@nestjs/common';

export type ErrorCode =
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'INTERNAL';

export interface ErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    fields?: Record<string, string>;
  };
}

/** Every failure leaves the API in the shape defined by spec §4.3, so the
 * Angular interceptor never has to branch on status codes (NFR-4). */
export class AppException extends HttpException {
  constructor(
    code: ErrorCode,
    message: string,
    status: HttpStatus,
    fields?: Record<string, string>,
  ) {
    const body: ErrorBody = { error: { code, message, ...(fields ? { fields } : {}) } };
    super(body, status);
  }

  static validation(message: string, fields?: Record<string, string>): AppException {
    return new AppException('VALIDATION_FAILED', message, HttpStatus.BAD_REQUEST, fields);
  }

  static notFound(message: string): AppException {
    return new AppException('NOT_FOUND', message, HttpStatus.NOT_FOUND);
  }

  static unauthorized(message: string): AppException {
    return new AppException('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED);
  }
}
