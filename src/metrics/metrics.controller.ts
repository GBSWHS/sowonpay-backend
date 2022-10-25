import { Controller, ForbiddenException, Get, Res, Sse, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { UserGuard } from '../users/users.guard'
import { Metrics, MetricsService } from './metrics.service'
import { MetricSseEvent, MetricSseService } from './sse/MetricSse.service'

@Controller('metrics')
export class MetricsController {
  constructor (
    private readonly metricSseService: MetricSseService,
    private readonly metricService: MetricsService
  ) {}

  @Sse('@sse')
  @UseGuards(UserGuard)
  public createMetricSSE (@Res({ passthrough: true }) res: Response): MetricSseEvent {
    if (!(res.locals.user.isAdmin as boolean)) {
      throw new ForbiddenException('NOT_AN_ADMIN')
    }

    return this.metricSseService.subscribe()
  }

  @Get()
  @UseGuards(UserGuard)
  public async getMetricInfo (@Res({ passthrough: true }) res: Response): Promise<Metrics> {
    if (!(res.locals.user.isAdmin as boolean)) {
      throw new ForbiddenException('NOT_AN_ADMIN')
    }

    return await this.metricService.getMetrics()
  }
}
