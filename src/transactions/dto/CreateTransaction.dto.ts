import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator'

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
}
