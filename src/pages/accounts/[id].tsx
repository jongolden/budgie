import { initializeApollo, addApolloState } from '../../lib/apollo-client';
import { ACCOUNTS_QUERY } from '../../components/AccountsList';
import { gql, useQuery } from '@apollo/client';
import { InferGetServerSidePropsType } from 'next';
import { FormattedNumber } from 'react-intl';
import Layout from 'src/components/Layout';
import TransactionsTable from 'src/components/TransactionsTable';

const ACCOUNT_QUERY = gql`
  query getAccount($id: String!) {
    account(id: $id) {
      name
      balance
      transactions {
        edges {
          node {
            id
            date
            payee
            category
            cleared
            amount
          }
        }
      }
    }
  }
`;

const Account = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { loading, data } = useQuery(ACCOUNT_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  if (id === '[id]' || loading) {
    return <div>Loading...</div>;
  }

  const { account } = data;

  return (
    <Layout>
      <header className="hero">
        <div className="pl-4 pr-4 pt-4 is-flex is-justify-content-space-between">
          <h1 className="title is-5 mr-4 mb-4">{account.name}</h1>
          <p className="title is-5">
            <FormattedNumber
              value={account.balance}
              style="currency"
              currency="USD"
            />
          </p>
        </div>
      </header>
      <main>
        <div className="is-flex is-justify-content-space-between p-1 has-background-black">
          <button className="button is-secondary is-small">
            Add Transaction
          </button>
          <div>
            <input
              className="input is-small"
              type="text"
              placeholder={`Search ${account.name}`}
            />
          </div>
        </div>
        <TransactionsTable transactions={account.transactions} />
      </main>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo();

  const { id } = context.query;

  await Promise.allSettled([
    apolloClient.query({
      query: ACCOUNTS_QUERY,
    }),
    apolloClient.query({
      query: ACCOUNT_QUERY,
      variables: { id },
    }),
  ]);

  return addApolloState(apolloClient, {
    props: {
      id,
    },
  });
}

export default Account;
