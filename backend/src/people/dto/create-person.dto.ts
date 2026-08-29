import { Type, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  MAX_CADENCE_DAYS,
  MIN_CADENCE_DAYS,
  RELATIONSHIP_TYPES,
  RelationshipType,
} from '../../common/domain';
import { IsIsoDate } from '../../common/validators';
import { PHONE_PATTERN } from '../../common/validators';
import { ImportantDateDto } from './important-date.dto';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() || null : value;

export class CreatePersonDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(2, 80)
  name: string;

  @IsIn(RELATIONSHIP_TYPES)
  relationshipType: RelationshipType;

  @IsOptional()
  @Transform(trim)
  @Matches(PHONE_PATTERN, { message: 'phone must be a valid phone number' })
  phone?: string | null;

  @IsOptional()
  @Transform(trim)
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string | null;

  @IsOptional()
  @IsInt()
  @Min(MIN_CADENCE_DAYS)
  @Max(MAX_CADENCE_DAYS)
  customCadenceDays?: number | null;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(2000)
  notes?: string | null;

  /** FR-1.4 chip value. `null`/omitted means "never contacted". */
  @IsOptional()
  @IsIsoDate()
  lastContactDate?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ImportantDateDto)
  importantDates?: ImportantDateDto[];
}
