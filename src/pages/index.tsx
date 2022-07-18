import { initializeApollo, addApolloState } from '../lib/apollo-client';
import { ACCOUNTS_QUERY } from '../components/AccountsList';
import Layout from 'src/components/Layout';

const Home = () => (
  <Layout>
    <main>Hello</main>
  </Layout>
);

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ACCOUNTS_QUERY,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}

export default Home;
