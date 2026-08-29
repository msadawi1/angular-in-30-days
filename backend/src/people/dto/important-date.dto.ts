import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsIsoDate } from '../../common/validators';

/** FR-3.6: both label and date are required on every row — an incomplete row
 * is a client-side bug, so the server rejects it rather than storing a stub. */
export class ImportantDateDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(1, 80)
  label: string;

  @IsIsoDate()
  date: string;
}
