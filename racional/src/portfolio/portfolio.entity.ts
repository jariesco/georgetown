import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { PortfolioEntry } from './portfolio.entry.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.portfolio)
  user: User;

  @OneToMany(() => PortfolioEntry, (entry) => entry.portfolio)
  entry: PortfolioEntry;

  @OneToMany(() => Order, (order) => order.portfolio)
  orders: Order[];

}