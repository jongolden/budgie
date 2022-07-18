import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @Column()
  date: Date;

  @Column()
  payee: string;

  @Column()
  category: string;

  @Column()
  amount: number;

  @Column()
  cleared: boolean;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;
}
