import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users/index.schema';
import { AddUserType } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { LoginInput } from '../inputs/user-input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async findOne(account: string): Promise<User | undefined> {
    Logger.log(this.userModel.findOne({ account }).exec());
    return this.userModel.findOne({ account }).exec();
  }
  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
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
        return token;
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
