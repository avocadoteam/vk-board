import { Injectable, CacheInterceptor, ExecutionContext } from '@nestjs/common';

@Injectable()
export class BoardCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';

    return 'board_list' + userId;
  }
}
@Injectable()
export class MembershipCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';
    const taskId = query['taskId'] ?? '1';

    return taskId + 'task_membership' + userId;
  }
}
