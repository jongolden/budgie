import { IEvent } from '@nestjs/cqrs';
import { ITransaction } from 'src/server/accounts/interfaces';

export class ActivityLogged implements IEvent {
  constructor(public readonly transaction: ITransaction) {}
}
