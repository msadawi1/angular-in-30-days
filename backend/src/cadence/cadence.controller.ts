import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { RelationshipType } from '../common/domain';
import { CadenceMap, CadenceService } from './cadence.service';
import { UpdateCadencesDto } from './dto/update-cadences.dto';

@Controller('config/cadences')
export class CadenceController {
  constructor(private readonly cadence: CadenceService) {}

  @Get()
  getOverrides(): Promise<CadenceMap> {
    return this.cadence.getOverrides();
  }

  /** FR-5.4 — count of active people per type who still follow the default. */
  @Get('usage')
  usage(): Promise<Record<RelationshipType, number>> {
    return this.cadence.usage();
  }

  @Put()
  replace(@Body() dto: UpdateCadencesDto): Promise<CadenceMap> {
    return this.cadence.replaceOverrides(dto);
  }

  @Delete()
  clear(): Promise<CadenceMap> {
    return this.cadence.clearOverrides();
  }
}
