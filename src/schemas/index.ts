import { User, UserSchema } from './users/index.schema';
import { Transactions, TransactionsSchema } from './transactions/index.schema';
export default function AllSchemas() {
  return {
    User,
    UserSchema,
    Transactions,
    TransactionsSchema,
  };
}
