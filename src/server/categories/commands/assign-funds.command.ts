import { ICommand } from '@nestjs/cqrs';

export class AssignFunds implements ICommand {
  constructor(
    public readonly category: string,
    public readonly amount: number,
  ) {}
}
