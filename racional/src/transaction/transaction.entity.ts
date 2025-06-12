import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column({ type: 'enum', enum: ['DEPOSIT', 'WITHDRAW'] })
  type: 'DEPOSIT' | 'WITHDRAW';

  @Column({ type: 'decimal' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}