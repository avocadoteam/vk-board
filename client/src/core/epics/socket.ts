import { ofType } from 'redux-observable';
import { AppEpic, SelectBoardListAction } from 'core/models';
import { filter, tap, ignoreElements, auditTime } from 'rxjs/operators';
import { safeCombineEpics } from './combine';
import { joinRoom } from 'core/socket/list';
import { getUserId } from 'core/selectors/user';

const joinRoomEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SELECT_BOARD_LIST'),
    filter<SelectBoardListAction>(({ payload }) => !!payload.data),
    auditTime(1500),
    tap(({ payload }) => {
      const { listguid } = payload.data!;
      const userId = getUserId(state$.value);
      console.log('go to room', listguid);
      joinRoom(userId, listguid);
    }),
    ignoreElements()
  );

export const socketEpics = safeCombineEpics(joinRoomEpic);
