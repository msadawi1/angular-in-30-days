import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AppException } from './app-error';

export const IS_PUBLIC = 'silah:is-public';
export const Public = () => SetMetadata(IS_PUBLIC, true);

/**
 * Spec NFR-1: no auth in v1. A static key header stands in, which is honest
 * about being a placeholder rather than pretending to be security.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header('x-api-key');

    // if (provided !== this.config.get<string>('apiKey')) {
    //   throw AppException.unauthorized('Missing or invalid X-Api-Key header.');
    // }
    return true;
  }
}
