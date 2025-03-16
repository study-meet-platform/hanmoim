import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt.payload';
import { Profile as NaverProfile } from 'passport-naver-v2';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async validateNaverUser(profile: NaverProfile): Promise<number> {
    const user: User = await this.usersService.findOneByProvider(
      profile.id,
      profile.provider,
    );
    if (!user) {
      const newUser: CreateUserDto = {
        nickname: profile.nickname,
        profileImage: profile.profileImage,
        email: profile.email,
        social: profile.provider,
        socialId: profile.id,
      };
      return (await this.usersService.create(newUser)).userId;
    }
    return user.userId;
  }

  async makeAccessToken(userId: number): Promise<string> {
    const payload: JwtPayload = { userId };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
    });
  }

  async makeRefreshToken(userId: number): Promise<string> {
    const payload: JwtPayload = { userId };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });
  }

  async userRefreshTokenUpdate(userId: number, refreshToken: string) {
    await this.usersService.update(userId, { refreshToken, mannerScore: 0 });
  }
}
