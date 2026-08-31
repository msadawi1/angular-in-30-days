import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PersonView } from '../people/person-view';
import { PersonViewService } from '../people/person-view.service';
import { ContactLog } from './contact-log.entity';
import { ContactLogsService } from './contact-logs.service';
import { CreateContactLogDto } from './dto/create-contact-log.dto';

@Controller('people/:personId/logs')
export class PersonLogsController {
  constructor(private readonly logs: ContactLogsService) {}

  @Get()
  findAll(@Param('personId', ParseUUIDPipe) personId: string): Promise<ContactLog[]> {
    return this.logs.findForPerson(personId);
  }

  @Post()
  create(
    @Param('personId', ParseUUIDPipe) personId: string,
    @Body() dto: CreateContactLogDto,
  ): Promise<ContactLog> {
    return this.logs.create(personId, dto);
  }
}

@Controller('logs')
export class LogsController {
  constructor(
    private readonly logs: ContactLogsService,
    private readonly view: PersonViewService,
  ) {}

  /** Returns the person with its recomputed lastContactDate and status
   * (FR-2.5), so the client does not need a follow-up fetch. */
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<PersonView> {
    return this.view.toView(await this.logs.remove(id));
  }
}
