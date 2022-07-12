import { Logger } from '@nestjs/common';
import {
  CommandHandler,
  EventPublisher,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../database/account.entity';
import { AccountAggregate } from '../domain/account.aggregate';
import { AccountNotFoundError } from '../exceptions/account-not-found.exception';

export class ClearTransaction implements ICommand {
  constructor(
    public readonly accountId: string,
    public readonly transactionId: string,
  ) {}
}

@CommandHandler(ClearTransaction)
export class ClearTransactionHandler
  implements ICommandHandler<ClearTransaction>
{
  private readonly logger = new Logger(ClearTransactionHandler.name);

  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    private readonly publisher: EventPublisher,
  ) {}

  async findAccount(accountId: string) {
    const entity = await this.repository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.transactions', 'transaction')
      .where('accountId = :accountId', { accountId })
      .getOne();

    if (!entity) {
      throw new AccountNotFoundError(accountId);
    }

    return new AccountAggregate(entity);
  }

  async execute(command: ClearTransaction): Promise<void> {
    try {
      this.logger.log('execute', { command });

      const { accountId, transactionId } = command;

      const account = this.publisher.mergeObjectContext(
        await this.findAccount(accountId),
      );

      account.clearTransaction(transactionId);

      account.commit();
    } catch (error) {
      this.logger.error(error, error.stack);

      throw error;
    }
  }
}
