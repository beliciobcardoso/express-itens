import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  exports: [AuthService, AuthGuard],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
})
export class AuthModule {}
