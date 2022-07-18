import AccountsList from './AccountsList';

const Layout = ({ children }) => (
  <div className="layout">
    <AccountsList />
    <div>{children}</div>
  </div>
);

export default Layout;
