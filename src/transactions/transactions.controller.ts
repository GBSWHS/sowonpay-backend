import { UseGuards, NotFoundException, Body, Res, Post, Controller } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '../auth/auth.guard'
import { CreateTransactionDto } from './dto/CreateTransaction.dto'
import { CreateTransactionResponseDto } from './dto/CreateTransactionRespose.dto'
import { TransactionService } from './transactions.service'

@Controller('transactions')
export class TransactionController {
  constructor (
    private readonly transactionService: TransactionService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
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
      receiver,
      sender: res.locals.user,
      booth
    })

    return {
      success: true
    }
  }
}
