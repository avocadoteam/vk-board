import { ofType } from 'redux-observable';
import { AppEpic, SelectBoardListAction } from 'core/models';
import { filter, tap, ignoreElements } from 'rxjs/operators';
import { safeCombineEpics } from './combine';
import { joinRoom } from 'core/socket/list';

const joinRoomEpic: AppEpic = (action$, state$) =>
  action$.pipe(
    ofType('SELECT_BOARD_LIST'),
    filter<SelectBoardListAction>(({ payload }) => !!payload.data),
    tap(({ payload }) => {
      const { listguid } = payload.data!;
      console.log('go to room', listguid);
      if (listguid) {
        joinRoom(listguid);
      }
    }),
    ignoreElements()
  );

export const socketEpics = safeCombineEpics(joinRoomEpic);
