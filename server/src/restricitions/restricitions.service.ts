import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MaxFreeListsPerPerson,
  MaxFreeMembershipInList,
} from 'src/constants/premium';
import { List } from 'src/db/tables/list';
import { PaymentService } from 'src/payment/payment.service';
import { Repository } from 'typeorm';

@Injectable()
export class RestricitionsService {
  constructor(
    private paymentService: PaymentService,
    @InjectRepository(List)
    private tableList: Repository<List>,
  ) {}

  async canUserContinueCreateLists(vkUserId: number) {
    const can =
      (await this.paymentService.hasUserPremium(vkUserId)) ||
      (await this.tableList.count({ createdBy: vkUserId, deleted: null })) <
        MaxFreeListsPerPerson;
    return can;
  }

  async canUserJoinList(vkUserId: number, listId: number) {
    const list = await this.tableList
      .createQueryBuilder('list')
      .innerJoin(
        'list.memberships',
        'membership',
        `membership.left_date is null and membership.list_id = ${listId}`,
      )
      .where(
        `list.id = ${listId} and created_by != ${vkUserId} and list.deleted is null`,
      )
      .select(['list.createdBy', 'membership'])
      .getOne();

    const can =
      (await this.paymentService.hasUserPremium(list?.createdBy ?? 0)) ||
      (list?.memberships.length ?? 0) < MaxFreeMembershipInList;

    return can;
  }
}
