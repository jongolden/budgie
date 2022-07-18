import { Logger } from '@nestjs/common';
import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../database/transaction.entity';
import { ITransaction } from '../interfaces';

export class TransactionAdded implements IEvent {
  constructor(
    public readonly transaction: ITransaction,
    public readonly addedAt: Date,
  ) {}
}

@EventsHandler(TransactionAdded)
export class TransactionAddedHandler
  implements IEventHandler<TransactionAdded>
{
  private readonly logger = new Logger(TransactionAddedHandler.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async saveTransaction(transaction: ITransaction): Promise<void> {
    const entity = new Transaction();
    entity.id = transaction.id;
    entity.accountId = transaction.accountId;
    entity.date = transaction.date;
    entity.payee = transaction.payee;
    entity.category = transaction.category;
    entity.amount = transaction.amount;
    entity.cleared = transaction.cleared;

    await this.transactionRepository.save(entity);
  }

  async handle(event: TransactionAdded) {
    this.logger.log('handle', { event });

    const { transaction } = event;

    await this.saveTransaction(transaction);
  }
}
