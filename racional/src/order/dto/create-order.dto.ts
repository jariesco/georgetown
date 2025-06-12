import { IsEnum, IsPositive, IsInt } from 'class-validator';

export class CreateOrderDto {
  @IsEnum(['BUY', 'SELL'])
  type: 'BUY' | 'SELL';

  @IsPositive()
  amount: number;

  @IsInt()
  portfolioId: number;

  @IsInt()
  stockId: number;
}
