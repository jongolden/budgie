import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { AdjustAvailableAmount } from 'src/categories/commands/adjust-available-amount.command';
import { LogActivity } from 'src/categories/commands/log-activity.command';
import { ActivityLogged } from 'src/categories/events/activity-logged.event';
import { CategoryAssigned } from 'src/accounts/events/category-assigned.event';
import { AdjustAvailableFundsFailed } from 'src/categories/events/adjust-available-funds-failed.event';
import { RemoveActivity } from 'src/categories/commands/remove-activity.command';
import { TransactionCleared } from 'src/accounts/events/transaction-cleared.event';
import { UnclearTransaction } from 'src/accounts/commands/unclear-transaction.command';

@Injectable()
export class AssignCategorySaga {
  private state = new Map<string, boolean>();

  @Saga()
  activityCleared(events$: Observable<IEvent>): Observable<ICommand | void> {
    return events$.pipe(
      ofType(TransactionCleared),
      map((event) => {
        this.state.set('activityCleared', true);

        const { transaction } = event;

        if (transaction.category) {
          return new LogActivity(
            transaction.category,
            transaction.amount,
            transaction.date,
          );
        }
      }),
    );
  }

  @Saga()
  categoryAssigned(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(CategoryAssigned),
      map((event) => {
        const { transaction } = event;

        return new LogActivity(
          transaction.category,
          transaction.amount,
          transaction.date,
        );
      }),
    );
  }

  @Saga()
  activityLogged(events$: Observable<IEvent>): Observable<ICommand> {
    return events$.pipe(
      ofType(ActivityLogged),
      map((event) => {
        this.state.set('activityLogged', true);

        const { transaction } = event;

        return new AdjustAvailableAmount(
          transaction.category,
          transaction.amount,
        );
      }),
    );
  }

  @Saga()
  adjustAvailableFundsFailed(
    events$: Observable<IEvent>,
  ): Observable<ICommand[]> {
    return events$.pipe(
      ofType(AdjustAvailableFundsFailed),
      map((event) => {
        const commands = [];

        if (this.state.get('activityLogged')) {
          commands.push(new RemoveActivity());
        }

        if (this.state.get('activityCleared')) {
          commands.push(new UnclearTransaction());
        }

        return commands;
      }),
    );
  }
}
