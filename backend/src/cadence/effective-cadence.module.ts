import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CadenceOverride } from './cadence-override.entity';
import { EffectiveCadenceService } from './effective-cadence.service';

@Module({
  imports: [TypeOrmModule.forFeature([CadenceOverride])],
  providers: [EffectiveCadenceService],
  exports: [EffectiveCadenceService],
})
export class EffectiveCadenceModule {}
