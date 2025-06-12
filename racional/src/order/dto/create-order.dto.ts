import { IsEnum, IsPositive, IsInt } from 'class-validator';

export class CreateOrderDto {
  @IsEnum(['BUY', 'SELL'])
  type: 'BUY' | 'SELL';

  @IsPositive()
  amount: number;

  @IsInt()
  userId: number;

  @IsInt()
  stockId: number;
}
