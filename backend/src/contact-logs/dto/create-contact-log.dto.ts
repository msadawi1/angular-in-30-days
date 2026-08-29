import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { CONTACT_TYPES, ContactType } from '../../common/domain';
import { IsIsoDate } from '../../common/validators';

export class CreateContactLogDto {
  @IsIn(CONTACT_TYPES)
  type: ContactType;

  /** Defaults to today when omitted (FR-2.1). Future dates are rejected. */
  @IsOptional()
  @IsIsoDate()
  date?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() || null : value))
  @IsString()
  @MaxLength(2000)
  notes?: string | null;
}
