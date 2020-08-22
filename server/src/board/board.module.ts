import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { ListModule } from 'src/list/list.module';
import { RestricitionsModule } from 'src/restricitions/restricitions.module';

@Module({
  imports: [RedisCacheModule, ListModule, RestricitionsModule],
  controllers: [BoardController],
})
export class BoardModule {}
