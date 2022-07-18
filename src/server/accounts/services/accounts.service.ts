import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Collection } from 'src/server/common/collection';
import { AddAccount } from '../commands/add-account.command';
import { AddTransaction } from '../commands/add-transaction.command';
import { ClearTransaction } from '../commands/clear-transaction.command';
import { AccountType, IAccount, ITransaction } from '../interfaces';
import { GetAccount } from '../queries/get-account.query';
import { GetAccounts } from '../queries/get-accounts.query';
import { GetTotalAccountInflow } from '../queries/get-total-account-inflow.query';
import { GetTotalAccountOutflow } from '../queries/get-total-account-outflow.query';
import { GetTotalAccountsBalance } from '../queries/get-total-accounts-balance.query';
import { GetTransactionsByAccountId } from '../queries/get-transactions-by-account-id.query';

export interface IAddTransactionDto {
  accountId: AccountID;
  payee: string;
  category: string;
  amount: number;
  transactionDate: Date;
}

export interface IAddAccountDto {
  name: string;
  type: AccountType;
  balance: number;
}

export interface IClearTransactionDto {
  accountId: string;
  transactionId: string;
}

@Injectable()
export class AccountsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  addAccount(dto: IAddAccountDto) {
    return this.commandBus.execute<AddAccount, void>(
      new AddAccount(dto.name, dto.type, dto.balance),
    );
  }

  addTransaction(dto: IAddTransactionDto) {
    return this.commandBus.execute<AddTransaction, void>(
      new AddTransaction(
        dto.accountId,
        dto.payee,
        dto.category,
        dto.amount,
        dto.transactionDate,
      ),
    );
  }

  clearTransaction(dto: IClearTransactionDto) {
    return this.commandBus.execute<ClearTransaction, void>(
      new ClearTransaction(dto.accountId, dto.transactionId),
    );
  }

  getAccount(id: string) {
    return this.queryBus.execute<GetAccount, IAccount>(new GetAccount(id));
  }

  getAccounts() {
    return this.queryBus.execute<GetAccounts, Collection<IAccount>>(
      new GetAccounts(),
    );
  }

  getTransactionsByAccountId(accountId: string) {
    return this.queryBus.execute<
      GetTransactionsByAccountId,
      Collection<ITransaction>
    >(new GetTransactionsByAccountId(accountId));
  }

  getTotalAccountsBalance() {
    return this.queryBus.execute<GetTotalAccountsBalance, number>(
      new GetTotalAccountsBalance(),
    );
  }

  getTotalAccountInflow(accountId: string) {
    return this.queryBus.execute<GetTotalAccountInflow, number>(
      new GetTotalAccountInflow(accountId),
    );
  }

  getTotalAccountOutflow(accountId: string) {
    return this.queryBus.execute<GetTotalAccountOutflow, number>(
      new GetTotalAccountOutflow(accountId),
    );
  }
}
