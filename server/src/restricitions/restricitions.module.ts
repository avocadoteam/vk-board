import { Module } from '@nestjs/common';
import { RestricitionsService } from './restricitions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/db/tables/payment';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { List } from 'src/db/tables/list';
import { ListMembership } from 'src/db/tables/listMembership';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, List, ListMembership]),
    RedisCacheModule,
  ],
  providers: [RestricitionsService],
  exports: [RestricitionsService],
})
export class RestricitionsModule {}
