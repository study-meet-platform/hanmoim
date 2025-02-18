import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  profileImage: string;

  @ApiProperty()
  @IsNumber()
  social: number;

  @ApiProperty()
  @IsString()
  @Exclude()
  socialId: string;
}
