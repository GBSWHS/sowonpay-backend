import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Booths } from 'src/booths/entity/Booths'
import { Transactions } from 'src/transactions/entity/Transactions'
import { Users } from 'src/users/entity/Users'
import { IsNull, Repository } from 'typeorm'

export interface Metrics {
  holds: number
  imports: number
  exports: number
}

@Injectable()
export class MetricsService {
  constructor (
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
    @InjectRepository(Booths)
    private readonly booths: Repository<Booths>,
    @InjectRepository(Transactions)
    private readonly trasactions: Repository<Transactions>
  ) {}

  public async getMetrics (): Promise<Metrics> {
    const userHolds = await this.users.find({
      select: {
        point: true
      }
    })

    const bankGives = await this.trasactions.find({
      select: {
        point: true
      },
      where: {
        boothId: IsNull()
      }
    })

    const boothHolds = await this.booths.find({
      select: {
        point: true
      }
    })

    return {
      holds: userHolds.reduce((prev, curr) => prev + curr.point, 0),
      imports: bankGives.reduce((prev, curr) => prev + curr.point, 0),
      exports: boothHolds.reduce((prev, curr) => prev + curr.point, 0)
    }
  }
}
