import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from '../people/people.module';
import { ContactLog } from './contact-log.entity';
import { LogsController, PersonLogsController } from './contact-logs.controller';
import { ContactLogsService } from './contact-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactLog]), PeopleModule],
  controllers: [PersonLogsController, LogsController],
  providers: [ContactLogsService],
})
export class ContactLogsModule {}
