import { Get, Res, UseGuards, Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { Response } from 'express'
import { UserGuard } from './users.guard'
import { UserService } from './users.service'
import { ConfirmPhoneVerifyDto } from './dto/ConfirmPhoneVerify.dto'
import { ConfirmPhoneVerifyResponseDto } from './dto/ConfirmPhoneVerifyResponse.dto'
import { CreatePhoneVerifyDto } from './dto/CreatePhoneVerify.dto'
import { CreatePhoneVerifyResposeDto } from './dto/CreatePhoneVerifyResponse.dto'
import { Users } from './entity/Users'

@Controller('users')
export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Get('/@me')
  @UseGuards(UserGuard)
  public async getMyInfo (@Res({ passthrough: true }) res: Response): Promise<Users> {
    return res.locals.user
  }

  @Post('/@phone-verify')
  public async createPhoneVerify (@Body() body: CreatePhoneVerifyDto): Promise<CreatePhoneVerifyResposeDto> {
    const user = await this.userService.getUserByPhone(body.phone)
    if (user == null) {
      throw new NotFoundException('PHONE_NUMBER_NOT_FOUND')
    }

    await this.userService.createVerification(user)

    return {
      success: true
    }
  }

  @Post('/@phone-verify-confirm')
  public async confirmPhoneVerify (@Body() body: ConfirmPhoneVerifyDto): Promise<ConfirmPhoneVerifyResponseDto> {
    const user = await this.userService.getUserByPhone(body.phone)
    if (user == null) {
      throw new NotFoundException('PHONE_NUMBER_NOT_FOUND')
    }

    const success = await this.userService.verifyVerification(user, body.code)
    if (!success) {
      return {
        success: false
      }
    }

    const token = this.userService.generateToken(user)

    return {
      success: true,
      token
    }
  }
}
