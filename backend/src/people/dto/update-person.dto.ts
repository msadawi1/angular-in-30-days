import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';

/** Every field optional — PATCH semantics. Cross-field rules (FR-3.4) are
 * checked in the service against the merged result, not per-request. */
export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
