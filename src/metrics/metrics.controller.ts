import { Controller, Res, Sse, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { UserGuard } from '../users/users.guard'
import { MetricSseEvent, MetricSseService } from './sse/MetricSse.service'

@Controller('metrics')
export class MetricsController {
  constructor (
    private readonly metricSseService: MetricSseService
  ) {}

  @Sse('@sse')
  @UseGuards(UserGuard)
  public createMetricSSE (@Res({ passthrough: true }) res: Response): MetricSseEvent {
    console.log(res.locals.user)
    return this.metricSseService.subscribe()
  }
}
