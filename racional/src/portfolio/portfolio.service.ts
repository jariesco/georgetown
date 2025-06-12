import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { User } from '../user/user.entity';


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
}
