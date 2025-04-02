import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('schedule')
export class Schedule {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @IsNumber()
  scheduleId: number;

  @ApiProperty()
  @Column()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @Column()
  @IsString()
  title: string;

  @ApiProperty()
  @Column()
  @IsString()
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  @IsDate()
  createdAt: string;

  @ApiProperty()
  @Column()
  @IsDate()
  eventTime: Date;
}
