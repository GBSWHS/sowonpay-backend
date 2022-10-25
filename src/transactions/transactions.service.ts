import { BadRequestException, CACHE_MANAGER, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Booths } from '../booths/entity/Booths'
import { Users } from '../users/entity/Users'
import { Repository } from 'typeorm'
import { Transactions } from './entity/Transactions'
import { PointSseService } from './sse/PointSse.service'
import { Cache } from 'cache-manager'
import { randomBytes } from 'crypto'
import { QRSseService } from './sse/QRSse.service'
import { Client as AligoClient } from 'aligo-smartsms'
import { ConfigService } from '@nestjs/config'
import { MetricSseService } from 'src/metrics/sse/MetricSse.service'

interface SendOption {
  sender: Users
  receiver: Users
  amount: number
  booth?: Booths
  qrkey: string
}

@Injectable()
export class TransactionService {
  private readonly aligo: AligoClient

  constructor (
    @InjectRepository(Transactions)
    private readonly transactions: Repository<Transactions>,
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
    @InjectRepository(Booths)
    private readonly booths: Repository<Booths>,
    private readonly pointSseService: PointSseService,
    private readonly qrSseService: QRSseService,
    configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManger: Cache,
    private readonly metricSseService: MetricSseService
  ) {
    this.aligo = new AligoClient({
      key: configService.get<string>('ALIGO_KEY', ''),
      user_id: configService.get<string>('ALIGO_USER_ID', ''),
      sender: configService.get<string>('ALIGO_SENDER', '')
    })
  }

  public async getUserViaQRKey (qrkey: string): Promise<Users | null> {
    const userId = await this.cacheManger.get<number>(`caches/qr/keys/${qrkey}`)
    if (userId === undefined) {
      return null
    }

    const user = await this.users.findOneBy({ id: userId })
    return user
  }

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
    const isForbidden = isGenerate && !option.sender.isAdmin

    if (isForbidden) {
      throw new ForbiddenException('USER_NOT_ALLOW_TO_GENERATE')
    }

    if (isGenerate) {
      const qrkey = await this.cacheManger.get<string>(`caches/qr/${option.receiver.id}`)
      if (qrkey === undefined || !qrkey.split(' ').includes(option.qrkey)) {
        throw new ForbiddenException('QR_TOKEN_INVALID')
      }

      await this.users.increment({ id: option.receiver.id }, 'point', option.amount)
      const receiver = await this.users.findOneByOrFail({ id: option.receiver.id })
      this.pointSseService.emit('USER', receiver.id, { point: receiver.point })
      this.metricSseService.emit({ receivedUser: receiver, point: option.amount, createdAt: new Date() })
      return
    }

    const qrkey = await this.cacheManger.get<string>(`caches/qr/${option.sender.id}`)
    if (qrkey === undefined || !qrkey.split(' ').includes(option.qrkey)) {
      throw new ForbiddenException('QR_TOKEN_INVALID')
    }

    if (option.sender.point < option.amount) {
      throw new BadRequestException('USER_BALANCE_TOO_LOW')
    }

    await this.booths.increment({ id: option.booth?.id }, 'point', option.amount)
    await this.users.increment({ id: option.sender.id }, 'point', -option.amount)

    const sender = await this.users.findOneByOrFail({ id: option.sender.id })
    const booths = await this.booths.findOneByOrFail({ id: option.booth?.id })

    this.pointSseService.emit('USER', sender.id, { point: sender.point })
    this.pointSseService.emit('BOOTH', booths.id, { point: booths.id })
    this.metricSseService.emit({ sentUser: sender, booth: booths, point: option.amount, createdAt: new Date() })

    await this.aligo.sendMessages({
      msg: `[소원페이]\n"${booths.name}" 부스에서 요금 "${option.amount}p"가 결제되었습니다.\n\n* 부정 결제시 즉시 신고`,
      msg_type: 'SMS',
      receiver: sender.phone
    })
  }

  private async createQRToken (userId: number): Promise<string> {
    const previous = await this.cacheManger.get<string>(`caches/qr/${userId}`) ?? Math.random().toString()
    const next = randomBytes(10).toString('hex').toUpperCase()
    if (previous.length > 0) {
      await this.cacheManger.del(`caches/qr/keys/${previous.split(' ')[0]}`)
    }

    await this.cacheManger.set(`caches/qr/keys/${next}`, userId)
    await this.cacheManger.set(`caches/qr/${userId}`, `${previous.split(' ')[1]} ${next}`, { ttl: 60 })

    return next
  }

  public async startQrSseProvider (userId: number): Promise<void> {
    const previous = await this.cacheManger.get<string>(`caches/qr/${userId}`)
    const fn = async (): Promise<void> => {
      const nextToken = await this.createQRToken(userId)
      this.qrSseService.emit(userId, { qrcode: nextToken })
    }

    void fn()
    if (previous === undefined) {
      setInterval(() => {
        void fn()
      }, 30 * 1000)
    }
  }
}
