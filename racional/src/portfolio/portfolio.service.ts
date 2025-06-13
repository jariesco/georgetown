import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { User } from '../user/user.entity';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { StockPriceService } from '../stock/stock-price.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private stockPriceService: StockPriceService
  ) {}

  async create(dto: CreatePortfolioDto): Promise<Portfolio> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    const portfolio = this.portfolioRepository.create({
      user,
      name: dto.name
    });
    return this.portfolioRepository.save(portfolio);
  }

  async update(id: number, updatePortfolioDto: UpdatePortfolioDto) {
    const portfolio = await this.portfolioRepository.findOneBy({ id });
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    Object.assign(portfolio, updatePortfolioDto);
    return this.portfolioRepository.save(portfolio);
  }

  async getSummary(portfolioId: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolioId },
      relations: ['entry', 'entry.stock', 'user'],
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    let totalValue = 0;

    const detailedEntries = await Promise.all(
      portfolio.entry.map(async entry => {
        const stockPrice = await this.stockPriceService.getPrice(entry.stock.ticker);
        const value = entry.quantity * stockPrice;
        totalValue += value;

        return {
          stock: entry.stock.ticker,
          quantity: entry.quantity,
          currentPrice: stockPrice,
          total: value,
        };
      })
    );

    return {
      portfolioId,
      userId: portfolio.user.id,
      entries: detailedEntries,
      totalValue,
    };
  }

}
