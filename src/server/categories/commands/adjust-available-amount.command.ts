import { ICommand } from '@nestjs/cqrs';

export class AdjustAvailableAmount implements ICommand {
  constructor(
    public readonly category: string,
    public readonly amount: number,
  ) {}
}
