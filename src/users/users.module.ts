import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './users.controller'
import { UserService } from './users.service'
import { Booths } from '../booths/entity/Booths'
import { Users } from './entity/Users'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Booths]),
    CacheModule.register(),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_TOKEN', 'youshallnotpass')
      })
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
