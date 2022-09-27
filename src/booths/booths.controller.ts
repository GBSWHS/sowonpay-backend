import { Controller, MessageEvent, Sse } from '@nestjs/common'
import { concatMap, interval, Observable } from 'rxjs'
import { BoothService } from './booths.service'

@Controller('booths')
export class BoothController {
  constructor (
    private readonly boothService: BoothService
  ) {}

  @Sse('@rank')
  public getRank (): Observable<MessageEvent> {
    return interval(1000)
      .pipe(concatMap(async () => ({
        data: await this.boothService.getRank()
      })))
  }
}
