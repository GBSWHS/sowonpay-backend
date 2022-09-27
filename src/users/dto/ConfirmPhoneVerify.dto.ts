import { IsString, Length } from 'class-validator'

export class ConfirmPhoneVerifyDto {
  @IsString()
  @Length(11, 11)
  public readonly phone: string

  @IsString()
  @Length(6, 6)
  public readonly code: string
}
