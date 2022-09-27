import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserMiddleware } from '../users/users.middleware'
import { UserModule } from '../users/users.module'
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
    UserModule,
    TransactionModule,
    BoothModule
  ]
})
export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserMiddleware)
      .forRoutes('*')
  }
}
