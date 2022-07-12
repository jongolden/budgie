import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { Account } from './accounts/database/account.entity';
import { Transaction } from './accounts/database/transaction.entity';
import { GraphQLGateway } from './graphql/graphql-gateway.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'ringo101',
      database: 'test',
      entities: [Account, Transaction],
      synchronize: true,
    }),
    GraphQLGateway,
    AccountsModule,
  ],
})
export class AppModule {}
