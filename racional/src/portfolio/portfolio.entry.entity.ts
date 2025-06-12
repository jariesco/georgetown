import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Stock } from '../stock/stock.entity';
import { Portfolio } from './portfolio.entity';

@Entity()
export class PortfolioEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.entry)
  portfolio: Portfolio;

  @ManyToOne(() => Stock, (stock) => stock.portfolioEntries)
  stock: Stock;

  @Column({ type: 'decimal' })
  quantity: number;
}