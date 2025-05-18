import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  @Inject()
  private readonly prismaService: PrismaService;

  async userAll() {
    const users = await this.prismaService.user.findMany();
    if (!users) throw new NotFoundException('No users found');
    return users;
  }

  // async getUserById(id: string): Promise<User> {
  //   if (!id) throw new NotFoundException('No id provided');
  //   const isValidId = /^[0-9a-fA-F]{24}$/.test(id);
  //   if (!isValidId) throw new NotFoundException('Invalid id provided');
  //   const userExists = await this.prismaService.user.findUnique({
  //     where: { id },
  //   });
  //   if (!userExists) throw new NotFoundException('User not found');
  //   const user = await this.prismaService.user.findUnique({
  //     where: { id },
  //   });
  //   if (!user) throw new NotFoundException('User not found');
  //   return user;
  // }

  // async createUser(data: Prisma.UserCreateInput): Promise<User> {
  //   if (!data) throw new NotFoundException('No data provided');
  //   const emailExists = await this.prismaService.user.findUnique({
  //     where: { email: data.email },
  //   });
  //   if (emailExists) throw new NotFoundException('User already exists');

  //   const user = await this.prismaService.user.create({ data });

  //   return user;
  // }

  // async updateUser(params: {
  //   where: Prisma.UserWhereUniqueInput;
  //   data: Prisma.UserUpdateInput;
  // }): Promise<User> {
  //   const { where, data } = params;

  //   const updatedUser = await this.prismaService.user.update({
  //     data,
  //     where,
  //   });

  //   return updatedUser;
  // }

  // deleteUser(id: string) {
  //   return console.log('deleteUser', id);
  // }
}
