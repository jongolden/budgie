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

export class AddTransaction implements ICommand {
  constructor(
    public readonly accountId: string,
    public readonly payee: string,
    public readonly category: string,
    public readonly amount: number,
    public readonly transactionDate: Date,
  ) {}
}

@CommandHandler(AddTransaction)
export class AddTransactionHandler implements ICommandHandler<AddTransaction> {
  private readonly logger = new Logger(AddTransactionHandler.name);

  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    private readonly publisher: EventPublisher,
  ) {}

  async findAccount(accountId: AccountID) {
    const entity = await this.repository.findOneBy({ id: accountId });

    return new AccountAggregate(entity);
  }

  async execute(command: AddTransaction): Promise<void> {
    this.logger.log('execute', { command });

    const { accountId, payee, category, amount, transactionDate } = command;

    const account = this.publisher.mergeObjectContext(
      await this.findAccount(accountId),
    );

    account.addTransaction({
      payee,
      category,
      amount,
      id: uuidv4(),
      accountId,
      date: transactionDate,
      cleared: false,
    });

    account.commit();
  }
}
