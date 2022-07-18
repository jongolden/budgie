import { Float, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AccountsService } from 'src/server/accounts/services/accounts.service';
import { AccountTransactionsConnection } from '../types/account';

@Resolver(() => AccountTransactionsConnection)
export class AccountTransactionsConnectionResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @ResolveField(() => Float)
  async totalInflow(@Parent() parent: AccountTransactionsConnection) {
    return this.accountsService.getTotalAccountInflow(parent.__accountId);
  }

  @ResolveField(() => Float)
  async totalOutflow(@Parent() parent: AccountTransactionsConnection) {
    return this.accountsService.getTotalAccountOutflow(parent.__accountId);
  }
}
