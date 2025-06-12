import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioEntry } from './portfolio.entry.entity';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntry, Portfolio])],
  providers: [PortfolioService],
  controllers: [PortfolioController]
})
export class PortfolioModule {}
