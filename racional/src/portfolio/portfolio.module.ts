import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioEntry } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntry])],
  providers: [PortfolioService],
  controllers: [PortfolioController]
})
export class PortfolioModule {}
