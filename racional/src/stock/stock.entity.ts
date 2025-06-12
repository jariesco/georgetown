import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../order/order.entity';
import { PortfolioEntry } from '../portfolio/portfolio.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ticker: string;

  @Column()
  name: string;

  @OneToMany(() => Order, (order) => order.stock)
  orders: Order[];

  @OneToMany(() => PortfolioEntry, (entry) => entry.stock)
  portfolioEntries: PortfolioEntry[];
}