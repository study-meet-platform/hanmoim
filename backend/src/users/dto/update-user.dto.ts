import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateUserDto extends PickType(PartialType(CreateUserDto), [
  'nickname',
  'profileImage',
  'email',
]) {
  @ApiProperty()
  @IsNumber()
  mannerScore: number;
}
