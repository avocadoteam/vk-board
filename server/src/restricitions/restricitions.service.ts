import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from 'src/db/tables/list';
import {
  MaxFreeListsPerPerson,
  MaxFreeMembershipInList,
} from 'src/constants/premium';
import { CacheManager } from 'src/custom-types/cache';
import { cacheKey, dayTTL } from 'src/contracts/cache';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class RestricitionsService {
  constructor(
    private paymentService: PaymentService,
    @InjectRepository(List)
    private tableList: Repository<List>,
    @Inject(CACHE_MANAGER)
    private cache: CacheManager,
  ) {}

  async canUserContinueCreateLists(vkUserId: number) {
    const cacheCan = await this.cache.get(cacheKey.canCreateList(vkUserId));

    if (cacheCan) {
      return cacheCan;
    }

    const can =
      (await this.tableList.count({ createdBy: vkUserId, deleted: null })) <
        MaxFreeListsPerPerson ||
      (await this.paymentService.hasUserPremium(vkUserId));

    await this.cache.set(cacheKey.canCreateList(vkUserId), can, {
      ttl: dayTTL,
    });

    return can;
  }

  async canUserJoinList(vkUserId: number, listId: number) {
    const cacheCan = await this.cache.get(
      cacheKey.canJoinList(vkUserId, listId),
    );

    if (cacheCan) {
      return cacheCan;
    }

    const list = await this.tableList
      .createQueryBuilder('list')
      .innerJoin(
        'list.memberships',
        'membership',
        `membership.left_date is null`,
      )
      .where(`list.id = ${listId} and created_by != ${vkUserId}`)
      .select(['list.createdBy', 'membership'])
      .getOne();

    const can =
      (list?.memberships.length ?? 0) < MaxFreeMembershipInList ||
      (await this.paymentService.hasUserPremium(list?.createdBy ?? 0));

    await this.cache.set(cacheKey.canJoinList(vkUserId, listId), can, {
      ttl: dayTTL,
    });

    return can;
  }
}
