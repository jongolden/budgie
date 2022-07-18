import { AggregateRoot } from '@nestjs/cqrs';
import { InvariantViolation } from 'src/server/common/invariant-violation';
import { AccountAdded } from '../events/account-added.event';
import { TransactionAdded } from '../events/transaction-added.event';
import { TransactionCleared } from '../events/transaction-cleared.event';
import { TransactionUncleared } from '../events/transaction-uncleared.event';
import { TransactionNotFoundError } from '../exceptions/transaction-not-found.exception';
import {
  AccountType,
  IAccount,
  IAccountProps,
  ITransaction,
} from '../interfaces';
import { Transaction } from '../value-types/transaction.type';
import { AccountAlreadyExists } from './account-already-exists.exception';

export class AccountAggregate extends AggregateRoot implements IAccount {
  public id: AccountID;
  public name: AccountName;
  public type: AccountType;
  public balance: AccountBalance;
  public transactions: ITransaction[];

  constructor(id: AccountID);
  constructor(props: IAccountProps);
  constructor(idOrProps: AccountID | IAccountProps) {
    super();

    if (this.isAccountId(idOrProps)) {
      this.id = idOrProps;
      this.transactions = [];
    } else {
      this.id = idOrProps.id;
      this.name = idOrProps.name;
      this.type = idOrProps.type;
      this.balance = idOrProps.balance;
      this.transactions = idOrProps.transactions;
    }
  }

  private isAccountId(idOrProps: any): idOrProps is AccountID {
    return typeof idOrProps === 'string';
  }

  addAccount(name: string, type: AccountType, balance: number) {
    if (this.name) {
      throw new AccountAlreadyExists(name);
    }

    if (this.type) {
      throw new InvariantViolation('Account type is required');
    }

    this.apply(new AccountAdded(this.id, name, type, balance, new Date()));
  }

  addTransaction(transaction: Transaction) {
    this.apply(new TransactionAdded(transaction, new Date()));
  }

  clearTransaction(id: TransactionID) {
    const transaction = this.transactions.find(
      (transaction) => transaction.id === id,
    );

    if (!transaction) {
      throw new TransactionNotFoundError(id);
    }

    this.apply(
      new TransactionCleared(
        {
          ...transaction,
          cleared: true,
        },
        new Date(),
      ),
    );
  }

  unclearTransaction(id: TransactionID) {
    const transaction = this.transactions.find(
      (transaction) => transaction.id === id,
    );

    this.apply(
      new TransactionUncleared(
        {
          ...transaction,
          cleared: false,
        },
        new Date(),
      ),
    );
  }

  onTransactionAdded(event: TransactionAdded) {
    const { transaction } = event;

    this.transactions.push(transaction);
  }

  onClearTransaction(event: TransactionCleared) {
    const { transaction } = event;

    this.transactions = this.transactions.map((transaction_) => {
      if (transaction.id === transaction_.id) {
        return {
          ...transaction,
          cleared: true,
        };
      }

      return transaction;
    });
  }

  onUnclearTransaction(event: TransactionUncleared) {
    const { transaction } = event;

    this.transactions = this.transactions.map((transaction_) => {
      if (transaction.id === transaction_.id) {
        return {
          ...transaction,
          cleared: false,
        };
      }

      return transaction;
    });
  }
}
