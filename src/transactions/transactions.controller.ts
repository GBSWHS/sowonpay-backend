import { UseGuards, NotFoundException, Body, Res, Post, Controller, Get, Query, Sse } from '@nestjs/common'
import { Response } from 'express'
import { UserGuard } from '../users/users.guard'
import { CreateTransactionDto } from './dto/CreateTransaction.dto'
import { CreateTransactionResponseDto } from './dto/CreateTransactionRespose.dto'
import { QRSseEvent, QRSseService } from './sse/QRSse.service'
import { TransactionService } from './transactions.service'

@Controller('transactions')
export class TransactionController {
  constructor (
    private readonly transactionService: TransactionService,
    private readonly qrSseService: QRSseService
  ) {}

  @Get('@user-by-key')
  @UseGuards(UserGuard)
  public async getUserIdByKey (@Query('qrkey') qrkey: string): Promise<{ id: number | null }> {
    const id = await this.transactionService.getUserViaQRKey(qrkey)

    return {
      id: id?.id ?? null
    }
  }

  @Sse('@sse-qr')
  @UseGuards(UserGuard)
  public createQRSSE (@Res({ passthrough: true }) res: Response): QRSseEvent {
    void this.transactionService.startQrSseProvider(res.locals.users.id)
    return this.qrSseService.subscribe(res.locals.users.id)
  }

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
        qrkey: body.qrkey,
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
      qrkey: body.qrkey,
      booth
    })

    return {
      success: true
    }
  }
}
