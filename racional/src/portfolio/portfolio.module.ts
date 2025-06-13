import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioEntry } from './portfolio.entry.entity';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntry, Portfolio, User]), UserModule, StockModule],
  providers: [PortfolioService],
  controllers: [PortfolioController]
})
export class PortfolioModule {}
