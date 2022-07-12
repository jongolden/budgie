import { Logger } from '@nestjs/common';
import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../database/account.entity';
import { AccountType } from '../interfaces';

export class AccountAdded implements IEvent {
  constructor(
    public readonly id: AccountID,
    public readonly name: string,
    public readonly type: AccountType,
    public readonly balance: number,
    public readonly addedAt: Date,
  ) {}
}

@EventsHandler(AccountAdded)
export class AccountAddedHandler implements IEventHandler<AccountAdded> {
  private readonly logger = new Logger(AccountAddedHandler.name);

  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  async handle(event: AccountAdded) {
    this.logger.log('handle', { event });

    const { id, name, type, balance } = event;

    const account = new Account();

    account.id = id;
    account.name = name;
    account.type = type;
    account.balance = balance;

    await this.repository.save(account);
  }
}
