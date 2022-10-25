import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Booths } from '../booths/entity/Booths'
import { Transactions } from '../transactions/entity/Transactions'
import { Users } from '../users/entity/Users'
import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'
import { MetricSseService } from './sse/MetricSse.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Booths, Transactions])
  ],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    MetricSseService
  ],
  exports: [MetricSseService]
})
export class MetricsModule {}
