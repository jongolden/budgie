import { FormattedDate, FormattedNumber } from 'react-intl';

const TransactionsTable = ({ transactions }) => {
  return (
    <table className="table is-fullwidth is-narrow">
      <thead>
        <tr>
          <th>
            <input type="checkbox" />
          </th>
          <th>Date</th>
          <th>Payee</th>
          <th>Category</th>
          <th>Outflow</th>
          <th>Inflow</th>
          <th>Cleared</th>
        </tr>
      </thead>
      <tbody>
        {transactions.edges.map((transactionEdge) => {
          const { date, payee, category, cleared, amount } =
            transactionEdge.node;

          return (
            <tr key={transactionEdge.cursor}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <FormattedDate value={date} />
              </td>
              <td>{payee}</td>
              <td>{category}</td>
              <td>
                {amount < 0 && (
                  <FormattedNumber
                    value={Math.abs(amount)}
                    style="currency"
                    currency="USD"
                  />
                )}
              </td>
              <td>
                {amount > 0 && (
                  <FormattedNumber
                    value={amount}
                    style="currency"
                    currency="USD"
                  />
                )}
              </td>
              <td>{cleared ? 'Y' : 'N'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
