import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormattedNumber } from 'react-intl';
import AddAccount from './AddAccount';

export const ACCOUNTS_QUERY = gql`
  {
    accounts {
      edges {
        cursor
        node {
          id
          name
          balance
        }
      }
      totalBalance
    }
  }
`;

const Account = ({ id, name, balance, isActive }) => (
  <Link href={`/accounts/${id}`}>
    <a
      className={`is-flex is-justify-content-space-between ${
        isActive ? 'is-active' : ''
      }`.trim()}
    >
      <div>{name}</div>
      <div>
        <FormattedNumber value={balance} style="currency" currency="USD" />
      </div>
    </a>
  </Link>
);

const AccountsList = () => {
  const [showAddAccount, setShowAddAccount] = useState(false);

  const { loading, data } = useQuery(ACCOUNTS_QUERY);

  const router = useRouter();
  const { id } = router.query;

  if (loading) {
    return <div>Loading</div>;
  }

  const { accounts } = data;

  return (
    <aside id="main-sidebar" className="aside">
      <nav className="menu active-menu--home">
        <p className="menu-label is-size-4">Budgie</p>
        <ul className="menu-list">
          <li>
            <a href="">Budget</a>
          </li>
          <li>
            <a href="">Reports</a>
          </li>
          <li>
            <a href="">All Accounts</a>
          </li>
        </ul>
        <p className="menu-label">Accounts</p>
        <ul className="menu-list">
          {accounts.edges.map((accountEdge) => (
            <li key={accountEdge.cursor}>
              <Account
                id={accountEdge.node.id}
                name={accountEdge.node.name}
                balance={accountEdge.node.balance}
                isActive={id === accountEdge.node.id}
              />
            </li>
          ))}
          <hr />
          <li>
            <button
              className="button is-primary ml-3"
              onClick={() => setShowAddAccount(true)}
            >
              Add Account
            </button>
          </li>
        </ul>
      </nav>
      <AddAccount
        isActive={showAddAccount}
        onClose={() => setShowAddAccount(false)}
      />
    </aside>
  );
};

export default AccountsList;
