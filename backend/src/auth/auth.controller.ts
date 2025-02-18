import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { NaverGuard } from './guards/naver.guard';
import { Request, Response } from 'express';
import { Profile } from './decorators/profile.decorator';
import { Profile as NaverProfile } from 'passport-naver-v2';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(NaverGuard)
  @Get('naver/redirect')
  async naverCallback(
    @Profile() profile: NaverProfile,
    @Res({ passthrough: true }) res: Response,
  ) {
    return res.redirect(this.configService.get<string>('CLIENT_URL'));
  }
}
