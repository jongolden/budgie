import { Field, ObjectType } from '@nestjs/graphql';
import { GraphConnection, GraphEdge, GraphNode, PageInfo } from './abstract';
import { Transaction } from './transaction';

@ObjectType()
export class Category implements GraphNode {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  transactions: CategoryTransactionsConnection;
}

@ObjectType()
export class CategoryTransactionEdge implements GraphEdge {
  @Field()
  cursor: string;

  @Field(() => Transaction)
  node: GraphNode;
}

@ObjectType()
export class CategoryTransactionsConnection implements GraphConnection {
  @Field(() => [CategoryTransactionEdge])
  edges: GraphEdge[];

  @Field()
  totalCount: number;

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
