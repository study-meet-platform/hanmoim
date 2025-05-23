import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PickType(PartialType(CreateUserDto), [
  'nickname',
  'profileImage',
  'email',
  'mannerScore',
]) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  refreshToken: string;
}
