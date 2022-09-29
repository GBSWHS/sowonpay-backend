import { Controller, MessageEvent, Param, Sse, UseGuards } from '@nestjs/common'
import { concatMap, interval, Observable } from 'rxjs'
import { PointSseEvent, PointSseService } from '../transactions/sse/PointSse.service'
import { UserGuard } from '../users/users.guard'
import { BoothService } from './booths.service'

@Controller('booths')
export class BoothController {
  constructor (
    private readonly boothService: BoothService,
    private readonly pointSseService: PointSseService
  ) {}

  @Sse('/:id/@sse-point')
  @UseGuards(UserGuard)
  public createPointSSE (@Param('id') id: string): PointSseEvent {
    return this.pointSseService.subscribe('BOOTH', Number(id))
  }

  @Sse('@rank')
  public getRank (): Observable<MessageEvent> {
    return interval(10 * 1000)
      .pipe(concatMap(async () => ({
        data: await this.boothService.getRank()
      })))
  }
}
