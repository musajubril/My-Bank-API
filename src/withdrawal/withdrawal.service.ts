import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../schemas/users/index.schema';
import { TransactionsDocument } from '../schemas/transactions/index.schema';
import { User } from '../schemas/users/index.schema';
import { Transactions } from '../schemas/transactions/index.schema';
import { MakeTransactionType } from 'src/dtos/make-transaction.dto';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transactions.name)
    private transactionsModel: Model<TransactionsDocument>,
  ) {}
  async findAll(userId: string): Promise<Transactions[]> {
    return this.transactionsModel.find({ type: 'withdrawal', userId }).exec();
  }

  async makeWithdrawal(
    makeTransactionType: MakeTransactionType,
    userId: string,
  ): Promise<Transactions> {
    const user = await this.userModel.findById({ _id: userId });
    await this.userModel
      .findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            amount_withdrawn:
              Number(user.amount_withdrawn) +
              Number(makeTransactionType.amount),
            amount_in_account:
              Number(user.amount_in_account) -
              Number(makeTransactionType.amount),
          },
        },
        {
          new: true,
          runValidators: true,
          upsert: true,
          returnOriginal: false,
          returnNewDocument: true,
        },
      )
      .exec();
    const withdrawal = new this.transactionsModel(makeTransactionType);
    return withdrawal.save();
  }
}
