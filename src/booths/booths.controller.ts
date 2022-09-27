import { Get, Controller } from '@nestjs/common'
import { BoothService } from './booths.service'
import { GetRankResposeDto } from './dto/GetRankResponse.dto'

@Controller('booths')
export class BoothController {
  constructor (
    private readonly boothService: BoothService
  ) {}

  @Get('@rank')
  public async getRank (): Promise<GetRankResposeDto> {
    const data = await this.boothService.getRank()

    return {
      success: true,
      data
    }
  }
}
