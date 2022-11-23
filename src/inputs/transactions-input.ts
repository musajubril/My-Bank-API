export class TransferInput {
  readonly account: string;
  readonly amount: number;
  readonly full_name: string;
  readonly bank: string;
}
export class WithdrawalInput {
  readonly amount: number;
}
export class DepositInput {
  readonly amount: number;
}
