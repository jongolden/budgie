import { Float, ResolveField, Resolver } from '@nestjs/graphql';
import { AccountsService } from 'src/server/accounts/services/accounts.service';
import { AccountsConnection } from '../types/account';

@Resolver(() => AccountsConnection)
export class AccountsConnectionResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @ResolveField(() => Float)
  totalBalance(): Promise<number> {
    return this.accountsService.getTotalAccountsBalance();
  }
}
