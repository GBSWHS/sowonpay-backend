import { IsHexadecimal, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  @IsInt()
  public readonly receiver: number

  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsOptional()
  public readonly booth?: number

  @IsNumber()
  @IsPositive()
  @IsInt()
  public readonly amount: number

  @IsString()
  @IsHexadecimal()
  public readonly qrkey: string
}
