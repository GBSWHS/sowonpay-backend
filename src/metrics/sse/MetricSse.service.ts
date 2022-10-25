import { Injectable } from '@nestjs/common'
import { EventEmitter } from 'events'
import { fromEvent, Observable } from 'rxjs'

export interface MetricSseData { point: number }
export type MetricSseEvent = Observable<MetricSseData>

@Injectable()
export class MetricSseService {
  private readonly emitter = new EventEmitter()

  public subscribe (): MetricSseEvent {
    return fromEvent(this.emitter, 'metric') as MetricSseEvent
  }

  public emit (data: MetricSseData): void {
    this.emitter.emit('metric', { data })
  }
}
