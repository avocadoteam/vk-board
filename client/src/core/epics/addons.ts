import { tapticDone } from 'core/vk-bridge/taptic';
import { TapticNotificationType } from '@vkontakte/vk-bridge';
import { isPlatformIOS } from 'core/selectors/settings';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AppDispatch } from 'core/models';
import { captureErrorAndNothingElse } from './errors';

export const tapTaptic = (type: TapticNotificationType) =>
  from(isPlatformIOS() ? tapticDone(type) : Promise.resolve()).pipe(
    mergeMap(() => [] as AppDispatch[]),
    captureErrorAndNothingElse('tapTaptic')
  );
