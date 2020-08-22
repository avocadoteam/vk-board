import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/db/tables/payment';
import { Repository, Connection } from 'typeorm';
import { premiumPrice } from 'src/constants/premium';
import { CacheManager } from 'src/custom-types/cache';
import { cacheKey, dayTTL } from 'src/contracts/cache';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private tablePayment: Repository<Payment>,
    private connection: Connection,
    @Inject(CACHE_MANAGER) private cache: CacheManager,
  ) {}

  async hasUserPremium(vkUserId: number) {
    const cacheHas = await this.cache.get<boolean>(cacheKey.hasPremium(vkUserId));

    if (cacheHas) {
      return cacheHas;
    }

    const has =
      (await this.tablePayment.count({
        user_id: vkUserId,
        amount: premiumPrice.toString(),
      })) > 0;

    await this.cache.set(cacheKey.hasPremium(vkUserId), has, {
      ttl: dayTTL,
    });

    return has;
  }

  async makePremium(vkUserId: number, amount: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newPayment = new Payment(amount, vkUserId);
      await queryRunner.manager.save(newPayment);

      await queryRunner.commitTransaction();

      await this.cache.del(cacheKey.hasPremium(vkUserId));

      return true;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }
}
