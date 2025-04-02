import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const newSchedule: Schedule =
      this.scheduleRepository.create(createScheduleDto);
    return await this.scheduleRepository.save(newSchedule);
  }

  async findByRange(startDate: Date, endDate: Date) {
    return await this.scheduleRepository
      .createQueryBuilder('entity')
      .where('entity.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getMany();
  }

  async findOne(scheduleId: number): Promise<Schedule> {
    return await this.scheduleRepository.findOneBy({ scheduleId });
  }

  async update(
    scheduleId: number,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<UpdateResult> {
    return await this.scheduleRepository.update(scheduleId, updateScheduleDto);
  }

  async remove(scheduleId: number): Promise<DeleteResult> {
    return await this.scheduleRepository.delete(scheduleId);
  }
}
