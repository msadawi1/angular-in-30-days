import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { MAX_CADENCE_DAYS, MIN_CADENCE_DAYS } from '../../common/domain';

/**
 * One optional field per relationship type rather than a free-form map, so an
 * unknown key is rejected as a validation error instead of persisted silently.
 */
export class CadenceOverridesDto {
  @IsOptional() @IsInt() @Min(MIN_CADENCE_DAYS) @Max(MAX_CADENCE_DAYS)
  immediate_family?: number;

  @IsOptional() @IsInt() @Min(MIN_CADENCE_DAYS) @Max(MAX_CADENCE_DAYS)
  extended_family?: number;

  @IsOptional() @IsInt() @Min(MIN_CADENCE_DAYS) @Max(MAX_CADENCE_DAYS)
  close_friend?: number;

  @IsOptional() @IsInt() @Min(MIN_CADENCE_DAYS) @Max(MAX_CADENCE_DAYS)
  friend?: number;

  @IsOptional() @IsInt() @Min(MIN_CADENCE_DAYS) @Max(MAX_CADENCE_DAYS)
  colleague?: number;

  @IsOptional() @IsInt() @Min(MIN_CADENCE_DAYS) @Max(MAX_CADENCE_DAYS)
  other?: number;
}

export class UpdateCadencesDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CadenceOverridesDto)
  overrides: CadenceOverridesDto;

  /** FR-5.5 — opt in to pinning the new value onto people who follow the
   * default. People with a manual override are never affected either way. */
  @IsOptional()
  @IsBoolean()
  applyToExisting?: boolean;
}
