import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class DBConfigService implements TypeOrmOptionsFactory {
  constructor (
    private readonly configService: ConfigService
  ) {}

  createTypeOrmOptions (): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 3306),
      username: this.configService.get<string>('DB_USER', 'sowonpay'),
      password: this.configService.get<string>('DB_PASSWD'),
      database: this.configService.get<string>('DB_SCHEMA', 'sowonpay'),
      autoLoadEntities: true,
      synchronize: this.configService.get<boolean>('DB_SYNC', false)
    }
  }
}
