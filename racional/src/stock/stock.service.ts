import { Injectable } from '@nestjs/common';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>
  ) {}

  async create(dto: CreateStockDto): Promise<Stock> {
    const stock = this.stockRepository.create(dto);
    return this.stockRepository.save(stock);
  }
}
