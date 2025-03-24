import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  eventTime: Date;
}
