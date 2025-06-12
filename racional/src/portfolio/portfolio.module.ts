import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './portfolio.entity';
import { PortfolioEntry } from './portfolio.entry.entity';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntry, Portfolio, User]), UserModule],
  providers: [PortfolioService],
  controllers: [PortfolioController]
})
export class PortfolioModule {}
