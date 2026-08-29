import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { RELATIONSHIP_TYPES, RelationshipType } from '../../common/domain';

export class QueryPeopleDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsIn(RELATIONSHIP_TYPES)
  type?: RelationshipType;
}
