import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateUserDto extends PickType(PartialType(CreateUserDto), [
  'nickname',
  'profileImage',
  'email',
]) {
  @ApiProperty()
  @IsNumber()
  mannerScore: number;

  @ApiProperty()
  @IsString()
  refreshToken: string;
}
