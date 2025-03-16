import {
  Controller,
  Get,
  NotAcceptableException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { NaverGuard } from './guards/naver.guard';
import { Request, Response } from 'express';
import { Profile } from './decorators/profile.decorator';
import { Profile as NaverProfile } from 'passport-naver-v2';
import { ConfigService } from '@nestjs/config';
import { KakaoGuard } from './guards/kakao.guard';
import { Profile as KakaoProfile } from 'passport-kakao';
import { GoogleGuard } from './guards/google.guard';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { RefreshGuard } from './guards/refresh.guard';
import { UserId } from '../decorators/user-id.decorator';
import { RefreshToken } from '../decorators/refresh-token.decorator';

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
    const userId: number = await this.authService.validateNaverUser(profile);

    const accessToken: string = await this.authService.makeAccessToken(userId);
    const refreshToken: string =
      await this.authService.makeRefreshToken(userId);
    await this.authService.userRefreshTokenUpdate(userId, refreshToken);

    return res
      .cookie('accessToken', accessToken)
      .cookie('refreshToken', refreshToken)
      .redirect(this.configService.get<string>('CLIENT_URL'));
  }

  @UseGuards(KakaoGuard)
  @Get('kakao/redirect')
  async kakaoCallback(
    @Profile() profile: KakaoProfile,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId: number = await this.authService.validateKakaoUser(profile);

    const accessToken: string = await this.authService.makeAccessToken(userId);
    const refreshToken: string =
      await this.authService.makeRefreshToken(userId);
    await this.authService.userRefreshTokenUpdate(userId, refreshToken);

    return res
      .cookie('accessToken', accessToken)
      .cookie('refreshToken', refreshToken)
      .redirect(this.configService.get<string>('CLIENT_URL'));
  }

  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  async googleCallback(
    @Profile() profile: GoogleProfile,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId: number = await this.authService.validateGoogleUser(profile);

    const accessToken: string = await this.authService.makeAccessToken(userId);
    const refreshToken: string =
      await this.authService.makeRefreshToken(userId);
    await this.authService.userRefreshTokenUpdate(userId, refreshToken);

    return res
      .cookie('accessToken', accessToken)
      .cookie('refreshToken', refreshToken)
      .redirect(this.configService.get<string>('CLIENT_URL'));
  }

  @UseGuards(RefreshGuard)
  @Post('logout')
  async logout(
    @UserId() userId: number,
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!(await this.authService.validateLogoutUser(userId, refreshToken))) {
      throw new NotAcceptableException('Invalid RefreshToken');
    }
    await this.authService.logoutUser(userId);
    return res
      .cookie('accessToken', '')
      .cookie('refreshToken', '')
      .redirect(this.configService.get<string>('CLIENT_URL'));
  }
}
