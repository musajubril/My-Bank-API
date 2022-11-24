import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users/index.schema';
import { AddUserType, ReturnUserType } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { LoginInput } from '../inputs/user-input';
import { JwtService } from '@nestjs/jwt';
import {
  Transactions,
  TransactionsDocument,
} from '../schemas/transactions/index.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transactions.name)
    private transactionsModel: Model<TransactionsDocument>,
    private jwtService: JwtService,
  ) {}

  async findOne(account: string): Promise<User | undefined> {
    return this.userModel.findOne({ account }).exec();
  }
  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async getMyAccount(
    userId: string,
  ): Promise<{ data: User; message: string; history: Transactions[] }> {
    const data = await this.userModel.findById({ _id: userId }).exec();
    const history = await this.transactionsModel.find({ userId }).exec();
    return {
      data,
      message: "User's data retrieved successfully",
      history: history.slice(0, 5),
    };
  }
  async getUser(account: string): Promise<{
    data: {
      full_name: string;
      account: string;
    };
    message: string;
  }> {
    const data = await this.userModel.findOne({ account }).exec();
    return {
      data: {
        full_name: data.full_name,
        account: data.account,
      },
      message: 'User retrieved successfully',
    };
  }
  async signIn(body: LoginInput): Promise<any> {
    const { account, pin } = body;
    const user = await this.userModel.findOne({ account });
    if (user) {
      if (bcrypt.compareSync(pin, user.pin)) {
        const payload = {
          userId: user._id,
          full_name: user.full_name,
          account: user.account,
          created: user.created,
          mobile_number: user.mobile_number,
        };
        const token = this.jwtService.sign(payload);
        return {
          message: 'Login Successful',
          access_token: token,
        };
      } else {
        return { message: 'Passwords do not match' };
      }
    } else {
      return { message: 'User does not exist' };
    }
  }
  async SignUp(addUserType: AddUserType): Promise<User> {
    const withdrawal = new this.userModel(addUserType);
    return withdrawal.save();
  }
}
