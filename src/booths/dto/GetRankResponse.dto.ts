import { Booths } from '../entity/Booths'

export class GetRankResposeDto {
  public readonly success: boolean

  public readonly data: Booths[]
}
