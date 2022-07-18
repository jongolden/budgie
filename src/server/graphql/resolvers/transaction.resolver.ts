import { Logger } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AccountNotFoundError } from 'src/server/accounts/exceptions/account-not-found.exception';
import { TransactionNotFoundError } from 'src/server/accounts/exceptions/transaction-not-found.exception';
import { AccountsService } from 'src/server/accounts/services/accounts.service';
import {
  Account,
  AccountNotFound,
  AddTransactionInput,
  AddTransactionResponse,
  AddTransactionSuccess,
  InternalError,
} from '../types/account';
import {
  ClearTransactionInput,
  ClearTransactionResponse,
  ClearTransactionSuccess,
  Transaction,
  TransactionNotFound,
} from '../types/transaction';

@Resolver(() => Transaction)
export class TransactionResolver {
  private readonly logger = new Logger(TransactionResolver.name);

  constructor(private readonly accountsService: AccountsService) {}

  @Mutation(() => AddTransactionResponse)
  async addTransaction(
    @Args('input') input: AddTransactionInput,
  ): Promise<typeof AddTransactionResponse> {
    try {
      await this.accountsService.addTransaction(input);

      return {
        __typename: 'AddTransactionSuccess',
        message: 'Transaction added',
      } as AddTransactionSuccess;
    } catch (error) {
      this.logger.error(error);

      return {
        __typename: 'InternalError',
        message: error.message,
      } as InternalError;
    }
  }

  @Mutation(() => ClearTransactionResponse)
  async clearTransaction(
    @Args('input') input: ClearTransactionInput,
  ): Promise<typeof ClearTransactionResponse> {
    try {
      await this.accountsService.clearTransaction(input);

      return {
        __typename: 'ClearTransactionSuccess',
        message: 'Transaction cleared',
      } as ClearTransactionSuccess;
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        return {
          __typename: 'AccountNotFound',
          message: error.message,
          accountId: input.accountId,
        } as AccountNotFound;
      }

      if (error instanceof TransactionNotFoundError) {
        return {
          __typename: 'TransactionNotFound',
          message: error.message,
          transactionId: input.transactionId,
        } as TransactionNotFound;
      }

      return {
        __typename: 'InternalError',
        message: error.message,
      } as InternalError;
    }
  }

  @ResolveField(() => Account)
  account(@Parent() transaction: Transaction) {
    console.log('transaction', transaction);
    return this.accountsService.getAccount(transaction.accountId);
  }
}
