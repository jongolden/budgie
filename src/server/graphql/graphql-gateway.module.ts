import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AccountResolver } from './resolvers/accounts.resolver';
import { AccountsModule } from 'src/server/accounts/accounts.module';
import { AccountsConnectionResolver } from './resolvers/accounts-connection.resolvers';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { AccountTransactionsConnectionResolver } from './resolvers/transactions-connection.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: 'src/server/graphql/schema.gql',
    }),
    AccountsModule,
  ],
  providers: [
    AccountResolver,
    AccountsConnectionResolver,
    TransactionResolver,
    AccountTransactionsConnectionResolver,
  ],
})
export class GraphQLGateway {}
