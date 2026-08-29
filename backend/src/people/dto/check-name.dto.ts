import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

/** FR-3.5 async validator. `excludeId` keeps the edit form from flagging a
 * person as a duplicate of themselves. */
export class CheckNameDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(1, 80)
  name: string;

  @IsOptional()
  @IsUUID()
  excludeId?: string;
}
