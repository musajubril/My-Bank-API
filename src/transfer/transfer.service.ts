import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../schemas/users/index.schema';
import { TransactionsDocument } from '../schemas/transactions/index.schema';
import { User } from '../schemas/users/index.schema';
import { Transactions } from '../schemas/transactions/index.schema';
import { MakeTransactionType } from 'src/dtos/make-transaction.dto';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transactions.name)
    private transactionsModel: Model<TransactionsDocument>,
  ) {}

  async findAll(userId: string): Promise<Transactions[]> {
    return this.transactionsModel.find({ type: 'transfer', userId }).exec();
  }

  async makeTransfer(
    makeTransactionType: MakeTransactionType,
    userId: string,
  ): Promise<Transactions> {
    const user = await this.userModel.findById({ _id: userId });
    await this.userModel
      .findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            amount_transferred:
              Number(user.amount_transferred) +
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
    const transfer = new this.transactionsModel(makeTransactionType);
    return transfer.save();
  }
}
