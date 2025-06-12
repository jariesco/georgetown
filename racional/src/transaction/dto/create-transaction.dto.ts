import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsEnum(['DEPOSIT', 'WITHDRAW'])
  type: 'DEPOSIT' | 'WITHDRAW';

  @IsPositive()
  amount: number;

  @IsNumber()
  userId: number;
}
