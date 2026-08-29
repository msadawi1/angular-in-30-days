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
import { Person } from './person.entity';

@Controller('people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}

  @Get()
  findAll(@Query() query: QueryPeopleDto): Promise<Person[]> {
    return this.people.findAll(query);
  }

  /** Declared before ':id' so "check-name" is never parsed as an id. */
  @Get('check-name')
  async checkName(@Query() query: CheckNameDto): Promise<{ exists: boolean }> {
    return { exists: await this.people.nameExists(query.name, query.excludeId) };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Person> {
    return this.people.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePersonDto): Promise<Person> {
    return this.people.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonDto,
  ): Promise<Person> {
    return this.people.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.people.remove(id);
  }
}
