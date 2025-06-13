import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';


export class GetOrdersDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 5; // por defecto trae 5 órdenes
}
