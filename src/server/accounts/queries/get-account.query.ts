import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../database/account.entity';
import { IAccount } from '../interfaces';

export class GetAccount {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetAccount)
export class GetAccountHandler implements IQueryHandler<GetAccount> {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  async execute(query: GetAccount): Promise<IAccount> {
    const { id } = query;

    return this.repository.findOneBy({ id });
  }
}
