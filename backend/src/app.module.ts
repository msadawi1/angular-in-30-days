import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CadenceModule } from './cadence/cadence.module';
import { buildDataSourceOptions, loadConfig } from './config/configuration';
import { ContactLogsModule } from './contact-logs/contact-logs.module';
import { HealthController } from './health.controller';
import { PeopleModule } from './people/people.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        buildDataSourceOptions(config.getOrThrow<string>('databasePath')),
    }),
    PeopleModule,
    ContactLogsModule,
    CadenceModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
