import { IsNotEmpty, IsInt } from 'class-validator';

export class CreatePortfolioDto {

  @IsInt()
  userId: number;

  @IsNotEmpty()
  name: string;
}
