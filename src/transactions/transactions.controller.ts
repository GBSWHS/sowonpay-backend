import { UseGuards, NotFoundException, Body, Res, Post, Controller } from '@nestjs/common'
import { Response } from 'express'
import { UserGuard } from '../users/users.guard'
import { CreateTransactionDto } from './dto/CreateTransaction.dto'
import { CreateTransactionResponseDto } from './dto/CreateTransactionRespose.dto'
import { TransactionService } from './transactions.service'

@Controller('transactions')
export class TransactionController {
  constructor (
    private readonly transactionService: TransactionService
  ) {}

  @Post()
  @UseGuards(UserGuard)
  public async createTransaction (
    @Body() body: CreateTransactionDto,
      @Res({ passthrough: true }) res: Response
  ): Promise<CreateTransactionResponseDto> {
    const receiver = await this.transactionService.getUser(body.receiver)

    if (receiver === null) {
      throw new NotFoundException('RECEIVER_NOT_FOUND')
    }

    if (body.booth === undefined) {
      await this.transactionService.sendOrGenerate({
        amount: body.amount,
        sender: res.locals.user,
        receiver
      })

      return {
        success: true
      }
    }

    const booth = await this.transactionService.getBooth(body.booth)
    if (booth === null) {
      throw new NotFoundException('BOOTH_NOT_FOUND')
    }

    await this.transactionService.sendOrGenerate({
      amount: body.amount,
      receiver: res.locals.user,
      sender: receiver,
      booth
    })

    return {
      success: true
    }
  }
}
