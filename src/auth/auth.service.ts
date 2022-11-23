import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/schemas/users/index.schema';
import * as bcrypt from 'bcrypt';
import { AddUserType, LoginType } from '../dtos/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async login(user: LoginType) {
    const payload = {
      acount: user.account,
      full_name: user.full_name,
      mobile_number: user.mobile_number,
      created: user.created,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: AddUserType) {
    user.pin = await bcrypt.hash(user.pin, 10);
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
