import { Injectable, CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { cacheKey } from 'src/contracts/cache';

@Injectable()
export class BoardCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';

    return cacheKey.boardList(userId);
  }
}
@Injectable()
export class MembershipCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';
    const taskId = query['taskId'] ?? '1';

    return cacheKey.membership(userId, taskId);
  }
}

@Injectable()
export class TasksCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';
    const listId = query['listId'] ?? '1';

    return cacheKey.tasks(userId, listId);
  }
}
