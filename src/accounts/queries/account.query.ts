import { IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../database/account.entity';

export abstract class AccountQueryHandler<T> implements IQueryHandler<T> {
  constructor(
    @InjectRepository(Account)
    protected readonly repository: Repository<Account>,
  ) {}

  abstract execute(query: T): Promise<any>;
}
