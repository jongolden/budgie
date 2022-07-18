import { Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventPublisher,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../database/account.entity';
import { AccountAggregate } from '../domain/account.aggregate';
import { AccountType } from '../interfaces';

export class AddAccount implements ICommand {
  constructor(
    public readonly name: AccountName,
    public readonly type: AccountType,
    public readonly balance: number,
  ) {}
}

@CommandHandler(AddAccount)
export class AddAccountHandler implements ICommandHandler<AddAccount> {
  private readonly logger = new Logger(AddAccountHandler.name);

  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    private readonly publisher: EventPublisher,
  ) {}

  async findAccount(name: AccountName) {
    const entity = await this.repository.findOneBy({ name });

    if (entity) {
      return new AccountAggregate(entity);
    }

    return new AccountAggregate(uuidv4());
  }

  async execute(command: AddAccount): Promise<any> {
    this.logger.log('execute', { command });

    const { name, type, balance } = command;

    const account = this.publisher.mergeObjectContext(
      await this.findAccount(name),
    );

    account.addAccount(name, type, balance);

    account.commit();
  }
}
