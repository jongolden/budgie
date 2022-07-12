import { Logger } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { AccountQueryHandler } from './account.query';

export class GetTotalAccountsBalance {}

@QueryHandler(GetTotalAccountsBalance)
export class GetTotalAccountsBalanceHandler extends AccountQueryHandler<GetTotalAccountsBalance> {
  private readonly logger = new Logger(GetTotalAccountsBalanceHandler.name);

  async execute(query: GetTotalAccountsBalance): Promise<number> {
    const { totalBalance } = await this.repository
      .createQueryBuilder()
      .select('sum(balance)', 'totalBalance')
      .getRawOne();

    this.logger.log('totalBalance', totalBalance, typeof totalBalance);

    return totalBalance;
  }
}
