import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transactions,
  TransactionsDocument,
} from './schemas/transactions/index.schema';
import { User, UserDocument } from './schemas/users/index.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transactions.name)
    private transactionsModel: Model<TransactionsDocument>,
  ) {}
  async findAll(
    userId: string,
  ): Promise<{ data: Transactions[]; message: string }> {
    const transactions = await this.transactionsModel
      .find({ userId })
      .sort({ created: -1 })
      .exec();
    return {
      data: transactions,
      message: 'All Transactions found successfully',
    };
  }
}
