import { ITransaction } from '../interfaces';

export class Transaction implements ITransaction {
  public readonly id: TransactionID;

  private constructor(
    public readonly accountId: AccountID,
    public readonly date: Date,
    public readonly payee: string,
    public readonly category: string,
    public readonly amount: number,
    public readonly cleared: boolean,
  ) {}

  static create(
    accountId: AccountID,
    date: Date,
    payee: string,
    category: string,
    amount: number,
    cleared = false,
  ): Transaction {
    return new Transaction(accountId, date, payee, category, amount, cleared);
  }
}
