import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthMiddleware } from '../auth/auth.middleware'
import { AuthModule } from '../auth/auth.module'
import { BoothModule } from '../booths/booths.module'
import { TransactionModule } from '../transactions/transactions.module'
import { DBConfigService } from './dbconfig.service'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DBConfigService,
      inject: [ConfigService]
    }),
    ConfigModule.forRoot(),
    AuthModule,
    TransactionModule,
    BoothModule
  ]
})
export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*')
  }
}
