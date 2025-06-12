import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { User } from '../user/user.entity';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';


@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    @InjectRepository(User)
    private userRepository: Repository<User>
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
}
