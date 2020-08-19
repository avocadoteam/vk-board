import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/db/tables/list';
import { Repository, Connection } from 'typeorm';
import {
  NewListModel,
  DropMembershipModel,
  EditListModel,
} from 'src/contracts/list';
import { CacheManager } from 'src/custom-types/cache';
import { cacheKey } from 'src/contracts/cache';
import { ListMembership } from 'src/db/tables/listMembership';
import { uniq, unnest } from 'ramda';
import { VkApiService } from 'src/vk-api/vk-api.service';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private tableList: Repository<List>,
    @InjectRepository(ListMembership)
    private tableListMembership: Repository<ListMembership>,
    private connection: Connection,
    private vkApiService: VkApiService,
    @Inject(CACHE_MANAGER) private cache: CacheManager,
  ) {}

  async getLists(vkUserId: number) {
    const qb = this.tableList.createQueryBuilder('list');
    let lists = await qb
      .innerJoin(
        'list.memberships',
        'membership',
        `membership.list_id = list.id and membership.left_date is null`,
      )
      .where([
        {
          deleted: null,
        },
      ])
      .andWhere(
        `${qb
          .subQuery()
          .select('mship.joined_id')
          .from(ListMembership, 'mship')
          .where(
            `mship.joined_id = ${vkUserId} and mship.left_date is null and mship.list_id = list.id`,
          )
          .take(1)
          .getQuery()} is not null`,
      )
      .setParameter('registered', true)
      .orderBy({
        'list.created': 'ASC',
      })
      .select([
        'list.name',
        'list.id',
        'list.created',
        'list.createdBy',
        'list.listguid',
        'membership.joinedId',
      ])
      .getMany();

    const dict: { [listId: number]: number[] } = {};

    for (const list of lists) {
      dict[list.id] = list.memberships.map((m) => m.joinedId);
    }

    const uniqUserIds = uniq(unnest(Object.values(dict)));

    const avatars = await this.vkApiService.updateWithAvatars(uniqUserIds);

    return lists.map((list) => ({
      ...list,
      memberships: list.memberships.map((lm) =>
        avatars.find((a) => a.userId === lm.joinedId),
      ),
    }));
  }

  async createList(model: NewListModel, vkUserId: number) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newList = new List(model.name, vkUserId);
      await queryRunner.manager.save(newList);

      const listMembership = new ListMembership(vkUserId, newList);
      await queryRunner.manager.save(listMembership);

      await queryRunner.commitTransaction();

      await this.cache.del(cacheKey.boardList(String(vkUserId)));

      return newList.id;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async isListExists(listId: number, createdBy: number) {
    return (
      (await this.tableList.count({
        where: [
          {
            id: listId,
            createdBy,
            deleted: null,
          },
          {
            id: listId,
            createdBy: null,
            deleted: null,
          },
        ],
      })) > 0
    );
  }

  async hasListMembership(listIds: number[], vkUserId: number) {
    return (
      (await this.tableList
        .createQueryBuilder('list')
        .innerJoin(
          'list.memberships',
          'membership',
          `membership.joined_id = ${vkUserId} and membership.left_date is null`,
        )
        .where([
          {
            deleted: null,
          },
        ])
        .andWhereInIds(listIds)
        .getCount()) > 0
    );
  }
  async isListOwner(listIds: number[], vkUserId: number) {
    return (
      (await this.tableList
        .createQueryBuilder('list')
        .innerJoin(
          'list.memberships',
          'membership',
          `membership.joined_id = ${vkUserId} and membership.left_date is null`,
        )
        .where([
          {
            deleted: null,
            createdBy: vkUserId,
          },
        ])
        .andWhereInIds(listIds)
        .getCount()) > 0
    );
  }
  async dropMembership(model: DropMembershipModel, vkUserId: number) {
    const now = new Date();

    await this.tableListMembership.update(
      { joinedId: model.userId, list: { id: model.listId } },
      { left_date: now, left_by: vkUserId },
    );

    await this.cache.del(cacheKey.boardList(String(vkUserId)));
  }

  async deleteList(listId: number, vkUserId: number) {
    const now = new Date();

    await this.tableList.update(listId, { deleted: now });

    await this.cache.del(cacheKey.boardList(String(vkUserId)));
  }

  async editListName(model: EditListModel, vkUserId: number) {
    await this.tableList.update(model.listId, { name: model.name });

    await this.cache.del(cacheKey.boardList(String(vkUserId)));
  }
}
