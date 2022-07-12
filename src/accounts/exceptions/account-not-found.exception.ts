export class AccountNotFoundError extends Error {
  constructor(accountId: string) {
    super(`Account ${accountId} could not be found`);
  }
}
