import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildQueryString } from 'src/utils/api';
import { vkApiV } from 'src/constants';

@Injectable()
export class VkApiService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async updateWithAvatars(userIds: number[]) {
    try {
      const ids = userIds.join(',');
      const result = await this.httpService
        .post(
          `https://api.vk.com/method/users.get${buildQueryString([
            { user_ids: `${ids}` },
            { fields: 'photo_100' },
            {
              access_token: this.configService.get<string>(
                'integration.vkServiceKey',
                '',
              ),
            },
            { v: vkApiV },
          ])}`,
        )
        .toPromise();

      if (result.data.error) {
        console.log(
          '[VkApiService] updateWithAvatars failed',
          result.data.error?.error_msg,
        );
        return [];
      }
      if (result.data.response && result.data.response.error) {
        console.log(
          '[VkApiService] updateWithAvatars failed',
          result.data.response?.error,
        );
        return [];
      }

      const avatars: {
        id: number;
        photo_100: string;
        first_name: string;
        last_name: string;
      }[] = result.data.response;

      const updatedUsers: {
        userId: number;
        avatar: string;
        name: string;
      }[] = avatars.map((a) => ({
        userId: a.id,
        avatar: a.photo_100,
        name: `${a.first_name || ''} ${a.last_name || ''}`,
      }));

      console.log('[VkApiService] updateWithAvatars done');
      return updatedUsers;
    } catch (error) {
      console.log('[VkApiService] updateWithAvatars error', error);
      return [];
    }
  }
}
