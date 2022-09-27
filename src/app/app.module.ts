import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthMiddleware } from 'src/auth/auth.middleware'
import { AuthModule } from 'src/auth/auth.module'
import { BoothModule } from 'src/booths/booths.module'
import { TransactionModule } from 'src/transactions/transactions.module'
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
