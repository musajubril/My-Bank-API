import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { TransferModule } from './transfer/transfer.module';
import { DepositModule } from './deposit/deposit.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { DepositService } from './deposit/deposit.service';
import { TransferService } from './transfer/transfer.service';
import { WithdrawalService } from './withdrawal/withdrawal.service';
import { UsersService } from './users/users.service';
import {
  Transactions,
  TransactionsSchema,
} from './schemas/transactions/index.schema';
import { User } from './schemas/users/index.schema';
import { UserSchema } from './schemas/users/index.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.ATLAS_URI),
    WithdrawalModule,
    TransferModule,
    DepositModule,
    UsersModule,
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transactions.name, schema: TransactionsSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    DepositService,
    TransferService,
    WithdrawalService,
    UsersService,
  ],
})
export class AppModule {}
