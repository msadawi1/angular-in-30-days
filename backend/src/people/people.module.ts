import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactLog } from '../contact-logs/contact-log.entity';
import { ImportantDate } from './important-date.entity';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { Person } from './person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, ImportantDate, ContactLog])],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
