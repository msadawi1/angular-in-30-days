import { Controller, Get } from '@nestjs/common';
import { Public } from './common/api-key.guard';

@Controller('health')
export class HealthController {
  /** Unauthenticated on purpose — it exists to answer "is the process up?",
   * and gating that behind the placeholder key would make it useless. */
  @Public()
  @Get()
  check(): { status: string; time: string } {
    return { status: 'ok', time: new Date().toISOString() };
  }
}
