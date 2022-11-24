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

  async findAll(
    userId: string,
  ): Promise<{ data: Transactions[]; message: string }> {
    const transfers = await this.transactionsModel
      .find({ type: ['transfer', 'transfer_to_me'], userId })
      .sort({ created: -1 })
      .exec();
    return {
      data: transfers,
      message: 'All Transfers returned successfully',
    };
  }

  async makeTransfer(
    makeTransactionType: MakeTransactionType,
    userId: string,
  ): Promise<{ data: Transactions; message: string }> {
    const isMyBank = makeTransactionType.bank === 'My Bank';
    const user = await this.userModel.findById({ _id: userId });
    const myBankUser = await this.userModel
      .findOne({ account: makeTransactionType.account })
      .exec();
    if (Number(user.amount_in_account) < Number(makeTransactionType.amount)) {
      return {
        message: 'Insufficient funds',
        data: makeTransactionType,
      };
    } else {
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
      isMyBank &&
        (await this.userModel
          .findOneAndUpdate(
            { account: makeTransactionType.account },
            {
              $set: {
                amount_deposited:
                  Number(myBankUser.amount_deposited) +
                  Number(makeTransactionType.amount),
                amount_in_account:
                  Number(myBankUser.amount_in_account) +
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
          .exec());
      const myBankTransfer =
        isMyBank &&
        new this.transactionsModel({
          ...makeTransactionType,
          type: 'transfer_to_me',
          userId: myBankUser._id,
          account: user.account,
          full_name: user.full_name,
        });
      const data = new this.transactionsModel(makeTransactionType);
      await data.save();
      isMyBank && (await myBankTransfer.save());
      return {
        data,
        message: 'Transfer successful',
      };
    }
  }
}
