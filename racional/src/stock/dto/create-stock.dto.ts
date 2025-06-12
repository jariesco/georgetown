// src/stock/dto/create-stock.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsString()
  ticker: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
