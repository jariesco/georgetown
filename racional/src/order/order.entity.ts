import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Stock } from '../stock/stock.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

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
