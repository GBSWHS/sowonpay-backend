import { Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfirmPhoneVerifyDto } from './dto/ConfirmPhoneVerify.dto'
import { ConfirmPhoneVerifyResponseDto } from './dto/ConfirmPhoneVerifyResponse.dto'
import { CreatePhoneVerifyDto } from './dto/CreatePhoneVerify.dto'
import { CreatePhoneVerifyResposeDto } from './dto/CreatePhoneVerifyResponse.dto'

@Controller('auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) {}

  @Post('/@phone-verify')
  public async createPhoneVerify (@Body() body: CreatePhoneVerifyDto): Promise<CreatePhoneVerifyResposeDto> {
    const user = await this.authService.getUserByPhone(body.phone)
    if (user == null) {
      throw new NotFoundException('PHONE_NUMBER_NOT_FOUND')
    }

    await this.authService.createVerification(user)

    return {
      success: true
    }
  }

  @Post('/@phone-verify-confirm')
  public async confirmPhoneVerify (@Body() body: ConfirmPhoneVerifyDto): Promise<ConfirmPhoneVerifyResponseDto> {
    const user = await this.authService.getUserByPhone(body.phone)
    if (user == null) {
      throw new NotFoundException('PHONE_NUMBER_NOT_FOUND')
    }

    const success = await this.authService.verifyVerification(user, body.code)
    if (!success) {
      return {
        success: false
      }
    }

    const token = await this.authService.generateToken(user)

    return {
      success: true,
      token
    }
  }
}
