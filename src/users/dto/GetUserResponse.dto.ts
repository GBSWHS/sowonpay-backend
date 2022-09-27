import { Users } from '../entity/Users'

export class GetUserResponseDto {
  public readonly success: boolean

  public readonly data: Users
}
