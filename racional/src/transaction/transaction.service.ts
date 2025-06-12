import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from '../user/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Actualizar el wallet balance
    if (dto.type === 'DEPOSIT') {
      user.walletBalance = Number(user.walletBalance) + Number(dto.amount);
    } else {
      if (user.walletBalance < dto.amount) {
        throw new BadRequestException('Insufficient balance for withdrawal');
      }
      user.walletBalance = Number(user.walletBalance) - Number(dto.amount);
    }

    const tx = this.transactionRepository.create({
      user,
      type: dto.type,
      amount: dto.amount,
    });

    await this.userRepository.save(user);
    return this.transactionRepository.save(tx);
  }
}
