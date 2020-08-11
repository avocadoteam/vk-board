import { Injectable, CacheInterceptor, ExecutionContext } from '@nestjs/common';

@Injectable()
export class BoardCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';

    return 'board_list' + userId;
  }
}
