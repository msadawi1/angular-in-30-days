import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { isIsoDate } from './dates';

/** Permissive on formatting, strict on content — international numbers with
 * spaces, dashes, parens and a leading + all pass (FR-3.2). */
export const PHONE_PATTERN = /^\+?[\d][\d\s().-]{5,24}$/;

export function IsIsoDate(options?: ValidationOptions) {
  return (target: object, propertyName: string): void => {
    registerDecorator({
      name: 'isIsoDate',
      target: target.constructor,
      propertyName,
      options,
      validator: {
        validate: (value: unknown) => typeof value === 'string' && isIsoDate(value),
        defaultMessage: (args: ValidationArguments) =>
          `${args.property} must be an ISO calendar date (YYYY-MM-DD)`,
      },
    });
  };
}
