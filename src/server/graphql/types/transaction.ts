import { createUnionType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { ITransaction } from 'src/server/accounts/interfaces';
import { GraphNode, MutationError } from './abstract';
import { Account, AccountNotFound, InternalError } from './account';

type TransactionNode = Omit<ITransaction, 'accountId' | 'category'>;

@ObjectType({ implements: GraphNode })
export class Transaction implements GraphNode {
  @Field()
  id: string;

  @Field()
  date: Date;

  @Field()
  payee: string;

  @Field()
  category: string;

  @Field()
  amount: number;

  @Field()
  cleared: boolean;

  @Field(() => Account)
  account: Account;

  accountId: string;
}

@InputType()
export class ClearTransactionInput {
  @Field()
  accountId: string;

  @Field()
  transactionId: string;
}

@ObjectType()
export class ClearTransactionSuccess {
  @Field()
  message: string;
}

@ObjectType()
export class TransactionNotFound implements MutationError {
  @Field()
  message: string;

  @Field()
  transactionId: string;
}

export const ClearTransactionResponse = createUnionType({
  name: 'ClearTransactionResponse',
  types: () => [
    ClearTransactionSuccess,
    TransactionNotFound,
    AccountNotFound,
    InternalError,
  ],
});
