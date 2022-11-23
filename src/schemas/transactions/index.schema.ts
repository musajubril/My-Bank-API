import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionsDocument = HydratedDocument<Transactions>;

@Schema()
export class Transactions {
  @Prop()
  amount: number;

  @Prop()
  created: Date;

  @Prop()
  account: string;

  @Prop()
  full_name: string;

  @Prop()
  bank: string;

  @Prop()
  user: string;

  @Prop()
  type: string;

  @Prop()
  userId: string;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions);
