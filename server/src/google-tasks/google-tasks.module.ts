import { Module, HttpModule } from '@nestjs/common';
import { GoogleTasksController } from './google-tasks.controller';
import { GoogleTasksService } from './google-tasks.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [GoogleTasksService],
  controllers: [GoogleTasksController],
})
export class GoogleTasksModule {}
