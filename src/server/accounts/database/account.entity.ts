import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AccountType, IAccount } from '../interfaces';
import { Transaction } from './transaction.entity';

@Entity()
export class Account implements IAccount {
  @PrimaryGeneratedColumn('uuid')
  id: AccountID;

  @Column('text')
  name: AccountName;

  @Column('smallint', { default: AccountType.Checking })
  type: AccountType;

  @Column('double', { default: 0 })
  balance: AccountBalance;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
