import { HttpModule, Module } from '@nestjs/common';
import { RestricitionsService } from './restricitions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/db/tables/payment';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { List } from 'src/db/tables/list';
import { PaymentService } from 'src/payment/payment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, List]),
    RedisCacheModule,
    HttpModule,
    ConfigModule,
  ],
  providers: [RestricitionsService, PaymentService],
  exports: [RestricitionsService],
})
export class RestricitionsModule {}
