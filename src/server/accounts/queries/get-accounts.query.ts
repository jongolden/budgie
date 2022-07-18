import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from 'src/server/common/collection';
import { Repository } from 'typeorm';
import { Account } from '../database/account.entity';
import { IAccount } from '../interfaces';

export class GetAccounts {}

@QueryHandler(GetAccounts)
export class GetAccountsHandler implements IQueryHandler<GetAccounts> {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  async execute(query: GetAccounts): Promise<Collection<IAccount>> {
    const items = await this.repository.find();

    return new Collection(items, items.length);
  }
}
