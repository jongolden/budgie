import { InvariantViolation } from 'src/common/invariant-violation';

export class AccountAlreadyExists extends InvariantViolation {
  constructor(accountName: string) {
    super(`${accountName} account already exists`);
  }
}
