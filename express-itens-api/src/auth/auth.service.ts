import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @Inject() private readonly userService: UserService;
  @Inject() private readonly jwtService: JwtService;

  userToken = { accessToken: '' };

  async validateUser(email: string, password: string): Promise<boolean> {
    const emailMatch = await this.userService.findUserByEmail(email);
    if (emailMatch.active === false) {
      throw new HttpException('User is inactive', HttpStatus.UNAUTHORIZED);
    }
    if (emailMatch) {
      const passwordMatch = await bcrypt.compare(password, emailMatch.password);
      if (passwordMatch) {
        const payload = { userId: emailMatch.id, role: emailMatch.role };
        const accessToken = this.jwtService.sign(payload);
        this.userToken.accessToken = accessToken;
        console.log(`User ${email} authenticated successfully.`);
        return true;
      }
    }
    return false;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; messenger?: string; expireIn?: string }> {
    const isValidUser = await this.validateUser(email, password);
    if (isValidUser) {
      console.log(
        `Generated JWT token for user ${email}: ${this.userToken.accessToken}`,
      );
      return {
        access_token: this.userToken.accessToken,
        expireIn: process.env.JWT_EXPIRATION,
        messenger: 'Login successful',
      };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
