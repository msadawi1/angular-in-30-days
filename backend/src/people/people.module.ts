import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EffectiveCadenceModule } from '../cadence/effective-cadence.module';
import { ContactLog } from '../contact-logs/contact-log.entity';
import { ImportantDate } from './important-date.entity';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { PersonViewService } from './person-view.service';
import { Person } from './person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, ImportantDate, ContactLog]), EffectiveCadenceModule],
  controllers: [PeopleController],
  providers: [PeopleService, PersonViewService],
  exports: [PeopleService, PersonViewService],
})
export class PeopleModule {}
