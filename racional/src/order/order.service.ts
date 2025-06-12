import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../user/user.entity';
import { Stock } from '../stock/stock.entity';
import { StockPriceService } from '../stock/stock-price.service';
import { PortfolioEntry } from '../portfolio/portfolio.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(PortfolioEntry)
    private portfolioRepository: Repository<PortfolioEntry>,
    private stockPriceService: StockPriceService
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const stock = await this.stockRepository.findOne({ where: { id: dto.stockId } });
    if (!stock) throw new NotFoundException('Stock not found');

    user.walletBalance = Number(user.walletBalance ?? 0);

    const price = this.stockPriceService.getPrice(stock.ticker);
    const addedQuantity = dto.amount / price;

    // const addedQuantity = dto.amount / stock.value

    if (dto.type === 'BUY') {
      if (user.walletBalance < dto.amount) {
        throw new BadRequestException('Insufficient wallet balance');
      }
      user.walletBalance -= dto.amount;

      // Update or create portfolio entry
      let entry = await this.portfolioRepository.findOne({
        where: { user: { id: user.id }, stock: { id: stock.id } },
      });

      if (entry) {
        entry.amountInvested += dto.amount;
        entry.quantity += addedQuantity;
      } else {
        entry = this.portfolioRepository.create({
          user,
          stock,
          amountInvested: dto.amount,
          quantity: addedQuantity,
        });
      }

      await this.portfolioRepository.save(entry);
    }

    if (dto.type === 'SELL') {
      const entry = await this.portfolioRepository.findOne({
        where: { user: { id: user.id }, stock: { id: stock.id } },
      });

      if (!entry || entry.quantity < addedQuantity) {
        throw new BadRequestException('Not enough stock quantity to sell');
      }

      entry.quantity -= addedQuantity;
      entry.amountInvested -= dto.amount;
      user.walletBalance += dto.amount;

      await this.portfolioRepository.save(entry);
    }

    const order = this.orderRepository.create({
      user,
      stock,
      type: dto.type,
      amount: dto.amount,
      quantity: addedQuantity,
    });

    await this.userRepository.save(user);
    return this.orderRepository.save(order);
  }
}
