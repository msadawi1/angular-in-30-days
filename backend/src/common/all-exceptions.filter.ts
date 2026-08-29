import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorBody, ErrorCode } from './app-error';

const STATUS_TO_CODE: Record<number, ErrorCode> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_FAILED',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
};

/** Catches everything — AppException, raw Nest exceptions, and unhandled
 * throws — and normalises it to the single error shape from spec §4.3. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json(this.toErrorBody(exception.getResponse(), status));
      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    const body: ErrorBody = {
      error: { code: 'INTERNAL', message: 'Unexpected server error.' },
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }

  private toErrorBody(payload: unknown, status: number): ErrorBody {
    if (this.isErrorBody(payload)) return payload;

    const message =
      typeof payload === 'string'
        ? payload
        : this.readMessage(payload) ?? 'Request failed.';

    return {
      error: { code: STATUS_TO_CODE[status] ?? 'INTERNAL', message },
    };
  }

  private isErrorBody(payload: unknown): payload is ErrorBody {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'error' in payload &&
      typeof (payload as ErrorBody).error?.code === 'string'
    );
  }

  private readMessage(payload: unknown): string | undefined {
    if (typeof payload !== 'object' || payload === null) return undefined;
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(' ');
    return undefined;
  }
}
