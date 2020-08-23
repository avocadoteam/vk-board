import { Module, HttpModule } from '@nestjs/common';
import { GoogleTasksController } from './google-tasks.controller';
import { GoogleTasksService } from './google-tasks.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from 'src/payment/payment.service';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { PaymentModule } from 'src/payment/payment.module';
import { Payment } from 'src/db/tables/payment';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    HttpModule,
    ConfigModule,
    RedisCacheModule,
    PaymentModule,
  ],
  providers: [GoogleTasksService, PaymentService],
  controllers: [GoogleTasksController],
})
export class GoogleTasksModule {}
