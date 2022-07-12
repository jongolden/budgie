import { IEvent } from '@nestjs/cqrs';
import { ITransaction } from 'src/accounts/interfaces';

export class ActivityLogged implements IEvent {
  constructor(public readonly transaction: ITransaction) {}
}
