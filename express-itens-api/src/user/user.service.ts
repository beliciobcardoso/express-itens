import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject()
  private readonly prismaService: PrismaService;

  async userAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prismaService.user.findMany();
    if (!users || users.length === 0)
      throw new NotFoundException('No users found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    return usersWithoutPassword;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<Omit<User, 'password'>> {
    const { where, data } = params;

    const updatedUser = await this.prismaService.user.update({
      data,
      where,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async UserById(id: string): Promise<User> {
    if (!id) throw new NotFoundException('No id provided');
    const userExists = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userExists) throw new NotFoundException('User not found');
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    if (!email) throw new NotFoundException('No email provided');
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    if (!data) throw new NotFoundException('No data provided');
    const emailExists = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (emailExists) throw new NotFoundException('User already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = { ...data, password: hashedPassword };

    const user = await this.prismaService.user.create({ data: userData });

    return user;
  }
}
