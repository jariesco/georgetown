import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Stock } from '../stock/stock.entity';
import { StockPriceService } from '../stock/stock-price.service';
import { User } from '../user/user.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { PortfolioEntry } from '../portfolio/portfolio.entry.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(PortfolioEntry)
    private portfolioEntryRepository: Repository<PortfolioEntry>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    private stockPriceService: StockPriceService
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const portfolio = await this.portfolioRepository.findOne({ where: { id: dto.portfolioId } });
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    const user = await this.userRepository.findOne({ where: { id: portfolio.user.id } });
    if (!user) throw new NotFoundException('User not found');

    const stock = await this.stockRepository.findOne({ where: { id: dto.stockId } });
    if (!stock) throw new NotFoundException('Stock not found');

    user.walletBalance = Number(user.walletBalance ?? 0);

    const price = this.stockPriceService.getPrice(stock.ticker);
    const addedQuantity = parseFloat((dto.amount / price).toFixed(3));

    // const addedQuantity = dto.amount / stock.value

    if (dto.type === 'BUY') {
      if (user.walletBalance < dto.amount) {
        throw new BadRequestException('Insufficient wallet balance');
      }
      user.walletBalance -= dto.amount;

      // Update or create portfolio entry
      let entry = await this.portfolioEntryRepository.findOne({
        where: { portfolio: { id: portfolio.id }, stock: { id: stock.id } },
      });

      if (entry) {
        entry.quantity = Number(entry.quantity) + Number(addedQuantity);
      } else {
        entry = this.portfolioEntryRepository.create({
          portfolio,
          stock,
          quantity: addedQuantity,
        });
      }

      await this.portfolioEntryRepository.save(entry);
    }

    if (dto.type === 'SELL') {
      const entry = await this.portfolioEntryRepository.findOne({
        where: { portfolio: { id: portfolio.id }, stock: { id: stock.id } },
      });

      if (!entry || entry.quantity < addedQuantity) {
        throw new BadRequestException('Not enough stock quantity to sell');
      }

      entry.quantity = Number(entry.quantity) - Number(addedQuantity);
      user.walletBalance += dto.amount;

      await this.portfolioEntryRepository.save(entry);
    }

    const order = this.orderRepository.create({
      portfolio,
      stock,
      type: dto.type,
      amount: dto.amount,
      quantity: addedQuantity,
    });

    await this.userRepository.save(user);
    return this.orderRepository.save(order);
  }
}
