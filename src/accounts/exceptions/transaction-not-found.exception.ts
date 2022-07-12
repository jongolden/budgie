export class TransactionNotFoundError extends Error {
  constructor(transactionId: string) {
    super(`Transaction ${transactionId} could not be found`);
  }
}
