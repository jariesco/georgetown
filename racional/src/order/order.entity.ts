import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Portfolio } from '../portfolio/portfolio.entity';
import { Stock } from '../stock/stock.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.orders)
  portfolio: Portfolio;

  @ManyToOne(() => Stock, (stock) => stock.orders)
  stock: Stock;

  @Column()
  type: 'BUY' | 'SELL';

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'decimal' })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
