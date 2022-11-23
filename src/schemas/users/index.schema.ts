import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  amount_in_account: number;

  @Prop()
  amount_deposited: number;

  @Prop()
  amount_withdrawn: number;

  @Prop()
  amount_transferred: number;

  @Prop()
  created: Date;

  @Prop()
  account: string;

  @Prop()
  mobile_number: string;

  @Prop()
  full_name: string;

  @Prop()
  pin: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
