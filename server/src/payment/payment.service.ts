import { Injectable, Inject, CACHE_MANAGER, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/db/tables/payment';
import { Repository, Connection } from 'typeorm';
import { premiumPrice, syncRestrictionHours } from 'src/constants/premium';
import { CacheManager } from 'src/custom-types/cache';
import { cacheKey, dayTTL } from 'src/contracts/cache';
import * as moment from 'moment';
import { EventBus } from 'src/events/events.bus';
import { BusEvents } from 'src/contracts/enum';
import { errMap } from 'src/utils/errors';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private tablePayment: Repository<Payment>,
    private connection: Connection,
    @Inject(CACHE_MANAGER) private cache: CacheManager,
  ) {}

  async hasUserPremium(vkUserId: number) {
    const cacheHas = await this.cache.get<number>(
      cacheKey.hasPremium(vkUserId),
    );

    if (cacheHas) {
      return cacheHas;
    }

    const pay = await this.tablePayment.findOne({
      where: [
        {
          user_id: vkUserId,
          amount: premiumPrice.toString(),
        },
      ],
    });

    await this.cache.set(cacheKey.hasPremium(vkUserId), pay?.id ?? 0, {
      ttl: dayTTL,
    });

    return pay?.id;
  }

  async makePremium(vkUserId: number, voices: string) {
    const id = await this.hasUserPremium(vkUserId);
    if (id) {
      this.logger.log(`User ${vkUserId} already bought the premium`);
      return id;
    }
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newPayment = new Payment(`${premiumPrice}`, voices, vkUserId);
      await queryRunner.manager.save(newPayment);

      await queryRunner.commitTransaction();

      this.logger.log(`User ${vkUserId} made a premium for voices: ${voices}`);

      await this.cache.del(cacheKey.hasPremium(vkUserId));

      EventBus.emit(BusEvents.PAYMENT_COMPLETE, vkUserId);

      return newPayment.id;
    } catch (err) {
      this.logger.error(errMap(err));
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async updatePremiumGoogleSync(user_id: number) {
    var now = new Date();
    this.logger.log(`Final step for g sync for user ${user_id}`);
    await this.tablePayment.update({ user_id }, { last_g_sync: now });

    await this.cache.del(cacheKey.googleSync(user_id));
    await this.cache.del(cacheKey.boardList(String(user_id)));

    EventBus.emit(BusEvents.STOP_G_SYNC, user_id);
  }

  async getDurationOf24HoursBeforeNewSync(user_id: number) {
    try {
      const cachedHrs = await this.cache.get<number>(
        cacheKey.googleSync(user_id),
      );
      if (cachedHrs) {
        return cachedHrs;
      }
      const paymentTime = await this.tablePayment.findOne({ user_id });

      if (!paymentTime || paymentTime.last_g_sync === null) {
        return syncRestrictionHours;
      }

      const computedDuration = moment.duration({
        from: moment().add(
          moment.duration(moment(paymentTime.last_g_sync).diff(moment())),
        ),
        to: moment(),
      });

      const hrs = computedDuration.asHours();

      await this.cache.set(cacheKey.googleSync(user_id), hrs, { ttl: 60 });
      return hrs;
    } catch (error) {
      this.logger.error(errMap(error));
      return syncRestrictionHours;
    }
  }
}
