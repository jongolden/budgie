import {
  createUnionType,
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { AccountType } from 'src/server/accounts/interfaces';
import {
  GraphConnection,
  GraphEdge,
  GraphNode,
  MutationError,
  PageInfo,
} from './abstract';
import { Transaction } from './transaction';

registerEnumType(AccountType, {
  name: 'AccountType',
});

@ObjectType({ implements: GraphConnection })
export class AccountTransactionsConnection implements GraphConnection {
  @Field(() => [AccountTransactionEdge])
  edges: AccountTransactionEdge[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  __accountId: string;
}

@ObjectType({ implements: GraphNode })
export class Account implements GraphNode {
  @Field()
  id: AccountID;

  @Field()
  name: string;

  @Field(() => AccountType)
  type: AccountType;

  @Field()
  balance: AccountBalance;

  @Field(() => AccountTransactionsConnection)
  transactions: AccountTransactionsConnection;
}

@ObjectType({ implements: GraphEdge })
export class AccountEdge implements GraphEdge {
  @Field()
  cursor: string;

  @Field(() => Account)
  node: Account;
}

@ObjectType({ implements: GraphConnection })
export class AccountsConnection implements GraphConnection {
  @Field(() => [AccountEdge])
  edges: GraphEdge[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Float)
  totalBalance: number;

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@ObjectType({ implements: GraphEdge })
export class AccountTransactionEdge implements GraphEdge {
  @Field()
  cursor: string;

  @Field(() => Transaction)
  node: GraphNode;
}

@InputType()
export class AddAccountInput {
  @Field()
  name: string;

  @Field(() => AccountType)
  type: AccountType;

  @Field(() => Float)
  balance: number;
}

@ObjectType({ implements: MutationError })
export class AccountExistsError implements MutationError {
  @Field()
  message: string;
}

@ObjectType()
export class AddAccountSuccess {
  @Field()
  message: string;
}

export const AddAccountResponse = createUnionType({
  name: 'AddAccountResponse',
  types: () => [AddAccountSuccess, AccountExistsError],
});

@InputType()
export class AddTransactionInput {
  @Field()
  accountId: string;

  @Field()
  payee: string;

  @Field()
  category: string;

  @Field()
  amount: number;

  @Field()
  transactionDate: Date;
}

@ObjectType({ implements: MutationError })
export class AccountDoesNotExistError implements MutationError {
  @Field()
  accountId: string;

  @Field()
  message: string;
}

@ObjectType()
export class AddTransactionSuccess {
  @Field()
  message: string;
}

@ObjectType({ implements: MutationError })
export class InternalError implements MutationError {
  @Field()
  message: string;
}

export const AddTransactionResponse = createUnionType({
  name: 'AddTransactionResponse',
  types: () => [AddTransactionSuccess, AccountDoesNotExistError, InternalError],
});

@ObjectType({ implements: MutationError })
export class AccountNotFound implements MutationError {
  @Field()
  message: string;

  @Field()
  accountId: string;
}
