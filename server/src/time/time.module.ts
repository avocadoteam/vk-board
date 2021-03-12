import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/db/tables/task';
import { TimeController } from './time.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TimeController],
})
export class TimeModule {}
