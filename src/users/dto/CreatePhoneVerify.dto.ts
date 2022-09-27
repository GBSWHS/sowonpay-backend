import { IsString, Length } from 'class-validator'

export class CreatePhoneVerifyDto {
  @IsString()
  @Length(11, 11)
  public readonly phone: string
}
