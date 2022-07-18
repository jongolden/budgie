import { ApolloProvider } from '@apollo/client';
import { IntlProvider } from 'react-intl';
import { useApollo } from '../lib/apollo-client';
import '../styles/main.scss';

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <IntlProvider locale="en" messages={{}}>
        <Component {...pageProps} />
      </IntlProvider>
    </ApolloProvider>
  );
};

export default App;
