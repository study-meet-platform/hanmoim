import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();

    if (err || !user) {
      return res.redirect(
        this.configService.get<string>('CLIENT_DOMAIN') + '/login',
      );
    }
    return user;
  }
}
