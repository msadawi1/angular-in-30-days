import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from '../people/people.module';
import { CadenceController } from './cadence.controller';
import { CadenceOverride } from './cadence-override.entity';
import { CadenceService } from './cadence.service';
import { EffectiveCadenceModule } from './effective-cadence.module';

@Module({
  imports: [TypeOrmModule.forFeature([CadenceOverride]), PeopleModule, EffectiveCadenceModule],
  controllers: [CadenceController],
  providers: [CadenceService],
})
export class CadenceModule {}
