import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;

  async validateUser(email: string, password: string): Promise<boolean> {
    const emailMatch = await this.userService.findUserByEmail(email);
    if (emailMatch) {
      const passwordMatch = await bcrypt.compare(password, emailMatch.password);
      if (passwordMatch) {
        console.log(`User ${email} authenticated successfully.`);
        return true;
      }
    }
    return false;
  }

  async login(email: string, password: string): Promise<string> {
    const isValidUser = await this.validateUser(email, password);
    if (isValidUser) {
      throw new HttpException('Login successful', HttpStatus.OK);
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
