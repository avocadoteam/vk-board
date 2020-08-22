import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/db/tables/payment';
import { Repository } from 'typeorm';
import { List } from 'src/db/tables/list';
import {
  MaxFreeListsPerPerson,
  MaxFreeMembershipInList,
} from 'src/constants/free-trial';
import { ListMembership } from 'src/db/tables/listMembership';
import { CacheManager } from 'src/custom-types/cache';
import { cacheKey, dayTTL } from 'src/contracts/cache';

@Injectable()
export class RestricitionsService {
  constructor(
    @InjectRepository(Payment)
    private tablePayment: Repository<Payment>,
    @InjectRepository(List)
    private tableList: Repository<List>,
    @InjectRepository(ListMembership)
    private tableListMembership: Repository<ListMembership>,
    @Inject(CACHE_MANAGER) private cache: CacheManager,
  ) {}

  async hasUserUnlimitedRights(vkUserId: number) {
    return (await this.tablePayment.count({ user_id: vkUserId })) > 0;
  }

  async canUserContinueCreateLists(vkUserId: number) {
    const cacheCan = await this.cache.get(cacheKey.canCreateList(vkUserId));

    if (cacheCan) {
      return cacheCan;
    }

    const can =
      (await this.tableList.count({ createdBy: vkUserId, deleted: null })) <
        MaxFreeListsPerPerson && !(await this.hasUserUnlimitedRights(vkUserId));

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

    const can =
      (await this.tableListMembership
        .createQueryBuilder('membership')
        .innerJoin(
          'membership.list',
          'list',
          `list.id = ${listId} and created_by != ${vkUserId}`,
        )
        .where([
          {
            left_date: null,
          },
        ])
        .getCount()) < MaxFreeMembershipInList &&
      !(await this.hasUserUnlimitedRights(vkUserId));

    await this.cache.set(cacheKey.canJoinList(vkUserId, listId), can, {
      ttl: dayTTL,
    });

    return can;
  }
}
