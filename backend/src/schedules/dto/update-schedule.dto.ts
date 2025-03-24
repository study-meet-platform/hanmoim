import { CreateScheduleDto } from './create-schedule.dto';
import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';

export class UpdateScheduleDto extends PickType(
  PartialType(CreateScheduleDto),
  ['title', 'description', 'eventTime'],
) {}
