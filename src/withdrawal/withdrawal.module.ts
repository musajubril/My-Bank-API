import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WithdrawalService } from './withdrawal.service';
import AllSchemas from '../schemas/';
const { User, UserSchema, Transactions, TransactionsSchema } = AllSchemas();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transactions.name, schema: TransactionsSchema },
    ]),
  ],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
