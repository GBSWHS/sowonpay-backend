import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Booths } from '../booths/entity/Booths'
import { Users } from '../auth/entity/Users'
import { Transactions } from './entity/Transactions'
import { TransactionService } from './transactions.service'
import { TransactionController } from './transactions.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transactions,
      Booths,
      Users
    ])
  ],
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}
