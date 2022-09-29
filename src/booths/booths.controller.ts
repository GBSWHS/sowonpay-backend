import { Controller, MessageEvent, Res, Sse, UseGuards } from '@nestjs/common'
import { Response } from 'express'
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

  @Sse('@sse-point')
  @UseGuards(UserGuard)
  public createPointSSE (@Res({ passthrough: true }) res: Response): PointSseEvent {
    return this.pointSseService.subscribe('USER', res.locals.user.id)
  }

  @Sse('@rank')
  public getRank (): Observable<MessageEvent> {
    return interval(30 * 1000)
      .pipe(concatMap(async () => ({
        data: await this.boothService.getRank()
      })))
  }
}
