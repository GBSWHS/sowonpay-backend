import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booths } from './entity/Booths'

@Injectable()
export class BoothService {
  constructor (
    @InjectRepository(Booths)
    private readonly booth: Repository<Booths>
  ) {}

  public async getRank (): Promise<Booths[]> {
    return await this.booth.find({
      order: {
        point: 'DESC'
      }
    })
  }
}
