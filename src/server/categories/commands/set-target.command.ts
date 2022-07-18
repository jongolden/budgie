import { ICommand } from '@nestjs/cqrs';

enum ETargetType {
  NeededForSpending = 1,
  SavingsBalance,
  MonthlySavingsBuilder,
  MonthlyDebtPayment,
}

interface Target {
  amount: number;
  targetType: ETargetType;
}

interface NeededForSpendingTarget extends Target {
  foo: 'monthly' | 'weekly' | Date;
  every: number;
}

export class SetTarget implements ICommand {
  constructor(
    public readonly category: string,
    public readonly target: Target,
  ) {}
}
