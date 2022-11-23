import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/auth/constants';
import { User, UserSchema } from 'src/schemas/users/index.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
