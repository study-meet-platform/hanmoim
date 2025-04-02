import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async create(
    @Body() createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    return await this.schedulesService.create(createScheduleDto);
  }

  // 기간 내의 일정들을 표시
  @Get()
  async findByRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Schedule[]> {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    return await this.schedulesService.findByRange(
      parsedStartDate,
      parsedEndDate,
    );
  }

  // 하나의 일정만 표시
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Schedule> {
    return await this.schedulesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<UpdateResult> {
    return await this.schedulesService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.schedulesService.remove(+id);
  }
}
