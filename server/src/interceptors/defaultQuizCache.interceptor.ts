import { Injectable, CacheInterceptor, ExecutionContext } from '@nestjs/common';

@Injectable()
export class DefaultQuizCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;
    const param = context.switchToHttp().getRequest().params;

    const userName = query['vkUserName'] ?? '_';
    const gender = query['gender'] ?? '0';
    const userId = query['vkUserId'] ?? '1';
    const puserId = param['vkUserId'] ?? '1';

    return userName + gender + userId + puserId;
  }
}
@Injectable()
export class FriendsCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';

    return 'friends' + userId;
  }
}
@Injectable()
export class QuizFriendsCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const query = context.switchToHttp().getRequest().query;

    const userId = query['vk_user_id'] ?? '1';

    return 'quiz_friends' + userId;
  }
}
