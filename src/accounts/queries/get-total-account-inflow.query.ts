import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../database/transaction.entity';

export class GetTotalAccountInflow {
  constructor(public readonly accountId: string) {}
}

@QueryHandler(GetTotalAccountInflow)
export class GetTotalAccountInflowHandler
  implements IQueryHandler<GetTotalAccountInflow>
{
  private readonly logger = new Logger(GetTotalAccountInflowHandler.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async execute(query: GetTotalAccountInflow): Promise<number> {
    this.logger.log('query', { query });

    const { accountId } = query;

    const result = await this.repository
      .createQueryBuilder()
      .select('sum(amount)', 'totalInflow')
      .where('amount > 0 and accountId = :accountId', { accountId })
      .getRawOne();

    this.logger.verbose('result', { result });

    return result.totalInflow || 0;
  }
}
