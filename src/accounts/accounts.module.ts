import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './database/account.entity';
import { AddTransactionHandler } from './commands/add-transaction.command';
import { Transaction } from './database/transaction.entity';
import { TransactionAddedHandler } from './events/transaction-added.event';
import { AccountsService } from './services/accounts.service';
import { AddAccountHandler } from './commands/add-account.command';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountAddedHandler } from './events/account-added.event';
import { GetAccountHandler } from './queries/get-account.query';
import { GetTransactionsByAccountIdHandler } from './queries/get-transactions-by-account-id.query';
import { GetAccountsHandler } from './queries/get-accounts.query';
import { GetTotalAccountsBalanceHandler } from './queries/get-total-accounts-balance.query';
import { GetTotalAccountInflowHandler } from './queries/get-total-account-inflow.query';
import { GetTotalAccountOutflowHandler } from './queries/get-total-account-outflow.query';
import { ClearTransactionHandler } from './commands/clear-transaction.command';
import { TransactionClearedHandler } from './events/transaction-cleared.event';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Account, Transaction])],
  providers: [
    AccountsService,
    AddAccountHandler,
    AccountAddedHandler,
    AddTransactionHandler,
    TransactionAddedHandler,
    GetAccountHandler,
    GetAccountsHandler,
    GetTransactionsByAccountIdHandler,
    GetTotalAccountsBalanceHandler,
    GetTotalAccountInflowHandler,
    GetTotalAccountOutflowHandler,
    ClearTransactionHandler,
    TransactionClearedHandler,
  ],
  exports: [TypeOrmModule, AccountsService],
})
export class AccountsModule {}
