import { CacheModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Booths } from '../booths/entity/Booths'
import { Users } from '../users/entity/Users'
import { Transactions } from './entity/Transactions'
import { TransactionService } from './transactions.service'
import { TransactionController } from './transactions.controller'
import { PointSseService } from './sse/PointSse.service'
import { QRSseService } from './sse/QRSse.service'
import { ConfigModule } from '@nestjs/config'
import { MetricSseService } from '../metrics/sse/MetricSse.service'
import { MetricsModule } from '../metrics/metrics.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transactions,
      Booths,
      Users
    ]),
    CacheModule.register(),
    ConfigModule,
    MetricsModule
  ],
  providers: [
    PointSseService,
    QRSseService,
    TransactionService,
    MetricSseService
  ],
  controllers: [TransactionController],
  exports: [PointSseService]
})
export class TransactionModule {}
