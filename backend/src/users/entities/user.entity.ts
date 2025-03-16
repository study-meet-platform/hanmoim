import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @Column()
  @IsString()
  nickname: string;

  @ApiProperty()
  @Column()
  @IsString()
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  profileImage: string;

  @ApiProperty()
  @Column()
  @IsString()
  social: string;

  @ApiProperty()
  @Column()
  @IsNumber()
  mannerScore: number;

  @ApiProperty()
  @Column()
  @IsString()
  @Exclude()
  socialId: string;

  @ApiProperty()
  @CreateDateColumn()
  @IsDate()
  @Exclude()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  @IsDate()
  @Exclude()
  updatedAt: string;

  @ApiProperty()
  @DeleteDateColumn()
  @IsDate()
  @Exclude()
  deletedAt: string;
}
