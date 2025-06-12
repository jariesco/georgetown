import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';


@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(dto: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create(dto);
    return this.portfolioRepository.save(portfolio);
  }
}
