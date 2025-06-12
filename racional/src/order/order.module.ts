import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { User } from '../user/user.entity';
import { Stock } from '../stock/stock.entity';
import { StockModule } from '../stock/stock.module';
import { PortfolioEntry } from '../portfolio/portfolio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Stock, PortfolioEntry]),
    StockModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
