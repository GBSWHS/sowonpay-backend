import { Injectable } from '@nestjs/common'
import { EventEmitter } from 'events'
import { fromEvent, Observable } from 'rxjs'

export interface PointSseData { point: number }
export type PointSseEvent = Observable<PointSseData>
export type PointSseType = 'USER' | 'BOOTH'

@Injectable()
export class PointSseService {
  private readonly emitter = new EventEmitter()

  public subscribe (type: PointSseType, id: number): PointSseEvent {
    return fromEvent(this.emitter, `events/point/${type}/${id}`) as PointSseEvent
  }

  public emit (type: PointSseType, id: number, data: PointSseData): void {
    this.emitter.emit(`events/point/${type}/${id}`, { data })
  }
}
