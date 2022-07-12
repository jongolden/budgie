export enum AccountType {
  Checking = 1,
  Savings,
  Cash,
  CreditCard,
  LineOfCredit,
  Mortgage,
  AutoLoan,
  StudentLoan,
  PersonalLoan,
  MedicalDebt,
  OtherDebt,
  Asset,
  Liability,
}

export interface ITransaction {
  id: TransactionID;
  accountId: AccountID;
  date: Date;
  payee: string;
  category: string;
  amount: number;
  cleared: boolean;
}

export interface IAccount {
  id: AccountID;
  name: AccountName;
  type: AccountType;
  balance: AccountBalance;
}

export interface IAccountProps extends IAccount {
  transactions: ITransaction[];
}
