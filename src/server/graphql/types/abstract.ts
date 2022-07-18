import { Field, Int, InterfaceType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;
}

@InterfaceType('Node')
export abstract class GraphNode {
  @Field()
  id: string;
}

@InterfaceType('Edge')
export abstract class GraphEdge {
  @Field()
  cursor: string;

  @Field()
  node: GraphNode;
}

@InterfaceType('Connection')
export abstract class GraphConnection {
  @Field(() => [GraphEdge])
  edges: GraphEdge[];

  @Field(() => Int)
  totalCount: number;

  @Field()
  pageInfo: PageInfo;
}

@InterfaceType('Error')
export abstract class MutationError {
  @Field()
  message: string;
}
