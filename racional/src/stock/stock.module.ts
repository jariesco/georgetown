import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockPriceService } from './stock-price.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers: [StockService, StockPriceService],
  controllers: [StockController],
  exports: [StockPriceService],
})
export class StockModule {}
