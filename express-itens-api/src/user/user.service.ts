import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  @Inject()
  private readonly prismaService: PrismaService;

  async userAll() {
    const users = await this.prismaService.user.findMany();
    if (!users) throw new NotFoundException('No users found');
    return users;
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
    if (!user) throw new NotFoundException('User not found');
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

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    const updatedUser = await this.prismaService.user.update({
      data,
      where,
    });

    return updatedUser;
  }
}
