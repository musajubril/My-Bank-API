export class AddUserType {
  amount_in_account: number;
  amount_deposited: number;
  amount_withdrawn: number;
  amount_transferred: number;
  created: Date;
  account: string;
  mobile_number: string;
  full_name: string;
  pin: string;
}
export class LoginType {
  created: Date;
  account: string;
  mobile_number: string;
  full_name: string;
  pin: string;
}
export class ReturnUserType {
  amount_in_account: number;
  amount_deposited: number;
  amount_withdrawn: number;
  amount_transferred: number;
  created: Date;
  account: string;
  mobile_number: string;
  full_name: string;
}
export class ReturnRequest {
  userId: string;
  full_name: string;
  account: string;
  created: Date;
  mobile_number: string;
  iat: number;
}
