import { IEvent } from '@nestjs/cqrs';
import { ITransaction } from '../interfaces';

export class CategoryAssigned implements IEvent {
  constructor(
    public readonly transaction: ITransaction,
    public readonly category: string,
  ) {}
}
