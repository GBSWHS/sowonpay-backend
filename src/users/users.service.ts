import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { Repository } from 'typeorm'
import { Users } from './entity/Users'
import { Client as AligoClient } from 'aligo-smartsms'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'

@Injectable()
export class UserService {
  private readonly aligo: AligoClient

  constructor (
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
    configService: ConfigService
  ) {
    this.aligo = new AligoClient({
      key: configService.get<string>('ALIGO_KEY', ''),
      user_id: configService.get<string>('ALIGO_USER_ID', ''),
      sender: configService.get<string>('ALIGO_SENDER', '')
    })
  }

  public async createVerification (user: Users): Promise<void> {
    const verifyKey = randomBytes(3).toString('hex').toUpperCase()
    await this.cacheManager.set(user.id.toString(), verifyKey, { ttl: 60 })
    await this.aligo.sendMessages({
      msg: `[소원페이]\n${user.name}님의 휴대폰 인증 번호는 아래와 같습니다.\n\n"${verifyKey}"`,
      msg_type: 'SMS',
      receiver: user.phone
    })
  }

  public async verifyVerification (user: Users, providedKey: string): Promise<boolean> {
    const verifyKey = await this.cacheManager.get<string>(user.id.toString())
    return verifyKey === providedKey
  }

  public async getUser (id: number, detail = false): Promise<Users> {
    const user = await this.users.findOne({
      where: { id },
      select: {
        id: true,
        isAdmin: detail,
        booths: detail,
        phone: detail,
        name: detail,
        point: true
      }
    })

    if (user === null) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return user
  }

  public async getUserByPhone (phone: string): Promise<Users | null> {
    return await this.users.findOneBy({ phone })
  }

  public generateToken (user: Users): string {
    return this.jwtService.sign({
      aud: user.id
    })
  }

  public async resolveToken (token: string): Promise<Users | null> {
    try {
      const payload = this.jwtService.verify(token)
      return await this.users.findOneBy({ id: payload.aud })
    } catch {
      return null
    }
  }
}
