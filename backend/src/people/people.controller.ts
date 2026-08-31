import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CheckNameDto } from './dto/check-name.dto';
import { CreatePersonDto } from './dto/create-person.dto';
import { QueryPeopleDto } from './dto/query-people.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PeopleService } from './people.service';
import { PersonView } from './person-view';
import { PersonViewService } from './person-view.service';

@Controller('people')
export class PeopleController {
  constructor(
    private readonly people: PeopleService,
    private readonly view: PersonViewService,
  ) {}

  @Get()
  async findAll(@Query() query: QueryPeopleDto): Promise<PersonView[]> {
    return this.view.toViews(await this.people.findAll(query));
  }

  /** Declared before ':id' so "check-name" is never parsed as an id. */
  @Get('check-name')
  async checkName(@Query() query: CheckNameDto): Promise<{ exists: boolean }> {
    return { exists: await this.people.nameExists(query.name, query.excludeId) };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PersonView> {
    return this.view.toView(await this.people.findOne(id));
  }

  @Post()
  async create(@Body() dto: CreatePersonDto): Promise<PersonView> {
    return this.view.toView(await this.people.create(dto));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonDto,
  ): Promise<PersonView> {
    return this.view.toView(await this.people.update(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.people.remove(id);
  }
}
