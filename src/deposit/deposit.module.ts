import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepositService } from './deposit.service';
import AllSchemas from '../schemas/';
const { User, UserSchema, Transactions, TransactionsSchema } = AllSchemas();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transactions.name, schema: TransactionsSchema },
    ]),
  ],
  providers: [DepositService],
})
export class DepositModule {}
