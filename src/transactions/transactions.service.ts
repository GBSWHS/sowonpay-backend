import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Booths } from '../booths/entity/Booths'
import { Users } from '../users/entity/Users'
import { Repository } from 'typeorm'
import { Transactions } from './entity/Transactions'

interface SendOption {
  sender: Users
  receiver: Users
  amount: number
  booth?: Booths
}

@Injectable()
export class TransactionService {
  constructor (
    @InjectRepository(Transactions)
    private readonly transactions: Repository<Transactions>,
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
    @InjectRepository(Booths)
    private readonly booths: Repository<Booths>
  ) {}

  public async getUser (id: number): Promise<Users | null> {
    return await this.users.findOneBy({ id })
  }

  public async getBooth (id: number): Promise<Booths | null> {
    return await this.booths.findOneBy({ id })
  }

  public async sendOrGenerate (option: SendOption): Promise<void> {
    await this.transactions.insert({
      ...((option.booth !== undefined) ? { boothId: option.booth.id } : {}),
      sentUserId: option.sender.id,
      receivedUserId: option.receiver.id,
      point: option.amount
    })

    const isGenerate = option.booth === undefined
    const isForbidden = !isGenerate || option.sender.isAdmin

    if (isForbidden) {
      throw new ForbiddenException('USER_NOT_ALLOW_TO_GENERATE')
    }

    if (!isGenerate) {
      await this.booths.increment({
        id: option.booth?.id
      }, 'point', option.amount)
      await this.users.increment({
        id: option.sender.id
      }, 'point', -option.amount)
    }

    await this.users.increment({
      id: option.receiver.id
    }, 'point', option.amount)
  }
}
