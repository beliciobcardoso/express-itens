import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  @Inject() private readonly authService: AuthService;

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    await this.authService.login(email, password);
  }
}
