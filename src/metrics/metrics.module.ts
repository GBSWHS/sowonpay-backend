import { Module } from '@nestjs/common'
import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'
import { MetricSseService } from './sse/MetricSse.service'

@Module({
  controllers: [MetricsController],
  providers: [
    MetricsService,
    MetricSseService
  ],
  exports: [MetricSseService]
})
export class MetricsModule {}
