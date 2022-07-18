import { IEvent } from '@nestjs/cqrs';
import { ITransaction } from '../interfaces';

export class TransactionUncleared implements IEvent {
  constructor(
    public readonly transaction: ITransaction,
    public readonly unclearedAt: Date,
  ) {}
}
