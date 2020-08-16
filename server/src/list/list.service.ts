import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/db/tables/list';
import { Repository, Connection } from 'typeorm';
import { NewListModel } from 'src/contracts/list';
import { CacheManager } from 'src/custom-types/cache';
import { cacheKey } from 'src/contracts/cache';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private tableList: Repository<List>,
    private connection: Connection,
    @Inject(CACHE_MANAGER) private cache: CacheManager,
  ) {}

  getLists(vkUserId: number) {
    return this.tableList
      .createQueryBuilder('list')
      .where([
        {
          createdBy: null,
        },
        {
          createdBy: vkUserId,
        },
      ])
      .orderBy({
        'list.created': 'ASC',
      })
      .select(['list.name', 'list.id', 'list.created'])
      .getMany();
  }

  async createList(model: NewListModel, vkUserId: number) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newList = new List(model.name, vkUserId);
      await queryRunner.manager.save(newList);
      await queryRunner.commitTransaction();

      await this.cache.del(cacheKey.boardList(String(vkUserId)));

      return newList.id;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
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
          },
          {
            id: listId,
            createdBy: null,
          },
        ],
      })) > 0
    );
  }
}
