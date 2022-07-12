import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../database/transaction.entity';
import { ITransaction } from '../interfaces';

export class TransactionCleared implements IEvent {
  constructor(
    public readonly transaction: ITransaction,
    public readonly clearedAt: Date,
  ) {}
}

@EventsHandler(TransactionCleared)
export class TransactionClearedHandler
  implements IEventHandler<TransactionCleared>
{
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async handle(event: TransactionCleared) {
    const { transaction, clearedAt } = event;

    const entity = await this.repository.findOneBy({
      id: transaction.id,
    });

    entity.cleared = true;

    await this.repository.save(entity);
  }
}
