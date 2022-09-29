import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionModule } from '../transactions/transactions.module'
import { BoothController } from './booths.controller'
import { BoothService } from './booths.service'
import { Booths } from './entity/Booths'

@Module({
  imports: [
    TypeOrmModule.forFeature([Booths]),
    TransactionModule
  ],
  controllers: [BoothController],
  providers: [BoothService]
})
export class BoothModule {}
