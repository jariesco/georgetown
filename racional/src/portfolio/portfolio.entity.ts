import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Stock } from '../stock/stock.entity';

@Entity()
export class PortfolioEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.portfolio)
  user: User;

  @ManyToOne(() => Stock, (stock) => stock.portfolioEntries)
  stock: Stock;

  @Column({ type: 'decimal' })
  amountInvested: number;

  @Column({ type: 'decimal' })
  quantity: number;
}