import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from 'src/server/common/collection';
import { Repository } from 'typeorm';
import { Transaction } from '../database/transaction.entity';

export class GetTransactionsByAccountId {
  constructor(public readonly accountId: string) {}
}

@QueryHandler(GetTransactionsByAccountId)
export class GetTransactionsByAccountIdHandler
  implements IQueryHandler<GetTransactionsByAccountId>
{
  private readonly logger = new Logger(GetTransactionsByAccountIdHandler.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async execute(
    query: GetTransactionsByAccountId,
  ): Promise<Collection<Transaction>> {
    this.logger.log('query', { query });

    const { accountId } = query;

    const transactions = await this.repository.findBy({
      accountId,
    });

    return new Collection(transactions, transactions.length);
  }
}
