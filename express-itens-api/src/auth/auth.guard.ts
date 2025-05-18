import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService;

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = this.extractTokenFromHeader(request);
    if (!authorization) throw new UnauthorizedException('Token is Required');
    try {
      const payload = this.jwtService.verify<Record<string, unknown>>(
        authorization,
        {
          secret: process.env.SECRET_KEY,
        },
      );
      request['userId'] = payload;
      return Promise.resolve(true);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        (error as { name?: string }).name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers?.['authorization'];
    const [type, token] =
      typeof authHeader === 'string' ? authHeader.split(' ') : [];
    return type === 'Bearer' ? token : undefined;
  }
}
