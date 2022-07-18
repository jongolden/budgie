import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { ACCOUNTS_QUERY } from './AccountsList';

export const ADD_ACCOUNT_MUATION = gql`
  mutation addAccount($input: AddAccountInput!) {
    addAccount(input: $input) {
      __typename
      ... on AddAccountSuccess {
        message
      }
      ... on Error {
        message
      }
    }
  }
`;

const useAddAccount = () => {
  const [addAccount] = useMutation(ADD_ACCOUNT_MUATION, {
    refetchQueries: [{ query: ACCOUNTS_QUERY }],
  });

  const handleAddAccount = async (input) => {
    const { data } = await addAccount({ variables: { input } });

    const { __typename: typename, message } = data.addAccount;

    return [typename, message];
  };

  return {
    addAccount: handleAddAccount,
  };
};

const AddAccount = ({ isActive = false, onClose }) => {
  const [account, setAccount] = useState({
    type: '',
    name: '',
    balance: 0,
  });

  const [isSuccess, setSuccess] = useState(false);

  const [error, setError] = useState('');

  const { addAccount } = useAddAccount();

  const handleSubmit = async () => {
    const [typename, message] = await addAccount({
      type: account.type,
      name: account.name,
      balance: Number(account.balance),
    });

    if (typename === 'AddAccountSuccess') {
      setSuccess(true);
    } else if (typename.endsWith('Error')) {
      setError(message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;

    setAccount({
      ...account,
      [name]: value,
    });
  };

  const formBody = (
    <>
      <div className="field">
        <div className="field-label">
          <label htmlFor="account-type" className="label">
            Account Type
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded">
              <div className="select">
                <select id="account-type" name="type" onChange={handleChange}>
                  <option>Select account type</option>
                  <option>Checking</option>
                  <option>Savings</option>
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Line of Credit</option>
                </select>
              </div>
            </p>
          </div>
        </div>
      </div>
      <div className="field">
        <div className="field-label">
          <label htmlFor="account-name" className="label">
            Account Name
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded">
              <input
                id="account-name"
                name="name"
                className="input"
                type="text"
                onChange={handleChange}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field">
        <div className="field-label">
          <label htmlFor="account-balance" className="label">
            Account Balance
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded">
              <input
                id="account-balanace"
                name="balance"
                className="input"
                type="number"
                onChange={handleChange}
              />
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const successNotification = (
    <div className="notification is-primary is-light">Success!</div>
  );

  const errorNotification = (message) => (
    <div className="notification is-danger is-light">{message}</div>
  );

  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`.trim()}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title is-size-5">Add Account</p>
          <button className="delete" aria-label="close" onClick={onClose} />
        </header>
        <section className="modal-card-body">
          {isSuccess && successNotification}
          {!!error && errorNotification(error)}
          {!isSuccess && !error && formBody}
        </section>
        <footer className="modal-card-foot is-flex is-justify-content-flex-end">
          {!error && !isSuccess && (
            <button className="button is-primary" onClick={handleSubmit}>
              Create
            </button>
          )}
          {isSuccess && (
            <button className="button is-primary" onClick={onClose}>
              Done
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default AddAccount;
