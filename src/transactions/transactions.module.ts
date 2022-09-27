import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Booths } from 'src/auth/entity/Booths'
import { Users } from 'src/auth/entity/Users'
import { Transactions } from './entity/Transactions'
import { TransactionService } from './transactions.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transactions,
      Booths,
      Users
    ])
  ],
  providers: [TransactionService]
})
export class TransactionModule {}
