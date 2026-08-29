import { ValidationError, ValidationPipe } from '@nestjs/common';
import { AppException } from './app-error';

/** Flattens class-validator output into the `fields` map of the spec §4.3
 * error shape: { "contactInfo.email": "must be a valid email" }. */
function flatten(errors: ValidationError[], prefix = ''): Record<string, string> {
  return errors.reduce<Record<string, string>>((fields, error) => {
    const path = prefix ? `${prefix}.${error.property}` : error.property;
    const messages = Object.values(error.constraints ?? {});
    if (messages.length) fields[path] = messages[0];
    if (error.children?.length) Object.assign(fields, flatten(error.children, path));
    return fields;
  }, {});
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: false },
    exceptionFactory: (errors: ValidationError[]) =>
      AppException.validation('Request validation failed.', flatten(errors)),
  });
}
