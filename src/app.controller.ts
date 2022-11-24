import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DepositService } from './deposit/deposit.service';
import { TransferService } from './transfer/transfer.service';
import { UsersService } from './users/users.service';
import { WithdrawalService } from './withdrawal/withdrawal.service';
import { MakeTransactionType } from 'src/dtos/make-transaction.dto';
import {
  DepositInput,
  TransferInput,
  WithdrawalInput,
} from './inputs/transactions-input';
import { Transactions } from './schemas/transactions/index.schema';
import { UserInput, LoginInput } from './inputs/user-input';
import { AddUserType } from './dtos/user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private readonly depositService: DepositService,
    private readonly transferService: TransferService,
    private readonly withdrawalService: WithdrawalService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  getAllTransactions(
    @Request() req,
  ): Promise<{ data: Transactions[]; message: string }> {
    return this.appService.findAll(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('transfer')
  getAllTransfers(
    @Request() req,
  ): Promise<{ data: Transactions[]; message: string }> {
    return this.transferService.findAll(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('deposit')
  getAllDeposits(
    @Request() req,
  ): Promise<{ data: Transactions[]; message: string }> {
    return this.depositService.findAll(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('withdrawal')
  getAllWithdrawal(
    @Request() req,
  ): Promise<{ data: Transactions[]; message: string }> {
    return this.withdrawalService.findAll(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  makeDeposit(
    @Body() body: DepositInput,
    @Request() req,
  ): Promise<{ data: Transactions; message: string }> {
    const deposit: MakeTransactionType = {
      ...body,
      type: 'deposit',
      created: new Date(),
      account: req.user.account,
      full_name: req.user.full_name,
      bank: 'My Bank',
      userId: req.user.userId,
    };
    return this.depositService.makeDeposit(deposit, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  makeTransfer(
    @Body() body: TransferInput,
    @Request() req,
  ): Promise<{ data: Transactions; message: string }> {
    const transfer: MakeTransactionType = {
      ...body,
      userId: req.user.userId,
      type: 'transfer',
      created: new Date(),
    };
    return this.transferService.makeTransfer(transfer, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('withdrawal')
  makeWithdrawal(
    @Body() body: WithdrawalInput,
    @Request() req,
  ): Promise<{ data: Transactions; message: string }> {
    const withdrawal: MakeTransactionType = {
      ...body,
      type: 'withdrawal',
      created: new Date(),
      userId: req.user.userId,
      account: req.user.account,
      full_name: req.user.full_name,
      bank: 'My Bank',
    };
    return this.withdrawalService.makeWithdrawal(withdrawal, req.user.userId);
  }
  @Post('register')
  async register(@Body() user: UserInput) {
    const newUser: AddUserType = {
      ...user,
      amount_in_account: 0,
      amount_deposited: 0,
      amount_withdrawn: 0,
      amount_transferred: 0,
      created: new Date(),
      account: user.mobile_number.slice(-10),
    };
    return this.authService.register(newUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('user')
  getMyAccount(@Request() req) {
    return this.usersService.getMyAccount(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/:account')
  async getUser(@Request() req, @Param('account') account: string) {
    return this.usersService.getUser(account);
  }
  @Post('login')
  async login(@Body() body: LoginInput) {
    return this.usersService.signIn(body);
  }
}
