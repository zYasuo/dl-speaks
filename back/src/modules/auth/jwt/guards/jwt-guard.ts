import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { AUTH_MODULE_TOKENS } from "../../constants/auth.tokens.constants";
  
  @Injectable()
  export class JwtGuard implements CanActivate {
    constructor(@Inject(AUTH_MODULE_TOKENS.JWT_SERVICE) private readonly jwt_service: JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);

      if (!token) {
        throw new UnauthorizedException();
      }

      try {
        const payload = await this.jwt_service.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        request["user"] = payload;
      } catch {
        throw new UnauthorizedException();
      }

      return true;
    }

  private extractToken(request: Request): string | undefined {
    const auth = request.headers.authorization;
    if (auth?.startsWith("Bearer ")) {
      return auth.slice(7);
    }
    return request.cookies?.access_token;
  }
  }