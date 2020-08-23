import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from 'src/db/tables/payment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), RedisCacheModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
