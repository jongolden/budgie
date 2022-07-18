import { ICommand } from '@nestjs/cqrs';

export class LogActivity implements ICommand {
  constructor(
    public readonly category: string,
    public readonly amount: number,
    public readonly activityDate: Date,
  ) {}
}
