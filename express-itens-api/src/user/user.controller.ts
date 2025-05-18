import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { User as UserModel } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Get()
  UserAll() {
    return this.userService.userAll();
  }

  @Get(':id')
  UserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.UserById(id);
  }

  @Get('email/:email')
  UserByEmail(@Param('email') email: string): Promise<UserModel> {
    return this.userService.findUserByEmail(email);
  }

  @Post()
  UserCreate(@Body() userData: Prisma.UserCreateInput): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  UserUpdate(
    @Body() userData: Prisma.UserUpdateInput,
    @Param('id') id: string,
  ): Promise<Omit<UserModel, 'password'>> {
    return this.userService.updateUser({ where: { id }, data: userData });
  }
}
