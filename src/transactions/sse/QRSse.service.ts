import { Injectable } from '@nestjs/common'
import { EventEmitter } from 'events'
import { fromEvent, Observable } from 'rxjs'

export interface QRSseData { qrcode: string }
export type QRSseEvent = Observable<QRSseData>

@Injectable()
export class QRSseService {
  private readonly emitter = new EventEmitter()

  public subscribe (id: number): QRSseEvent {
    return fromEvent(this.emitter, `events/QR/${id}`) as QRSseEvent
  }

  public emit (id: number, data: QRSseData): void {
    this.emitter.emit(`events/QR/${id}`, { data })
  }
}
