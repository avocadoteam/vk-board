import { tapticDone } from 'core/vk-bridge/taptic';
import { TapticNotificationType } from '@vkontakte/vk-bridge';
import { tap } from 'rxjs/operators';
import { isPlatformIOS } from 'core/selectors/settings';

export const tapTaptic = (type: TapticNotificationType) =>
  tap(() => {
    if (isPlatformIOS()) {
      tapticDone(type);
    }
  });
