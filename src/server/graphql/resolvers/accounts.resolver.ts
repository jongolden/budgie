import { Logger } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AccountAlreadyExists } from 'src/server/accounts/domain/account-already-exists.exception';
import { IAccount } from 'src/server/accounts/interfaces';
import { AccountsService } from 'src/server/accounts/services/accounts.service';
import { GraphConnection, MutationError } from '../types/abstract';
import {
  Account,
  AccountExistsError,
  AccountsConnection,
  AccountTransactionsConnection,
  AddAccountInput,
  AddAccountResponse,
  AddAccountSuccess,
} from '../types/account';

@Resolver(() => Account)
export class AccountResolver {
  private readonly logger = new Logger(AccountResolver.name);

  constructor(private readonly accountsService: AccountsService) {}

  private createCursor(value: string) {
    return Buffer.from(value).toString('base64');
  }

  @Query(() => Account)
  account(@Args('id') id: string) {
    return this.accountsService.getAccount(id);
  }

  @Query(() => AccountsConnection)
  async accounts(): Promise<GraphConnection> {
    const { items, totalCount } = await this.accountsService.getAccounts();

    return {
      edges: items.map((account) => ({
        cursor: this.createCursor(account.id),
        node: account,
      })),
      totalCount,
      pageInfo: {
        hasNextPage: false,
      },
    };
  }

  @Mutation(() => AddAccountResponse)
  async addAccount(
    @Args('input') input: AddAccountInput,
  ): Promise<typeof AddAccountResponse> {
    try {
      await this.accountsService.addAccount(input);

      return {
        __typename: 'AddAccountSuccess',
        message: 'Successfully created account',
      } as AddAccountSuccess;
    } catch (error) {
      if (error instanceof AccountAlreadyExists) {
        return {
          __typename: 'AccountExistsError',
          message: error.message,
        } as AccountExistsError;
      }

      return {
        message: error.message,
      } as MutationError;
    }
  }

  @ResolveField(() => AccountTransactionsConnection)
  async transactions(
    @Parent() account: IAccount,
  ): Promise<AccountTransactionsConnection> {
    const { items, totalCount } =
      await this.accountsService.getTransactionsByAccountId(account.id);

    console.log(items);

    return {
      edges: items.map((transaction) => ({
        cursor: Buffer.from(transaction.id).toString('base64'),
        node: transaction,
      })),
      totalCount,
      pageInfo: {
        hasNextPage: false,
      },
      __accountId: account.id,
    };
  }
}
