import * as moment from 'moment';
import {
  isBeforeTomorrow,
  MarusyaUserChoice,
  MarusyaUserChoiceVoice,
} from 'src/contracts/marusya';

export const sliceTasks = (
  tasks: {
    title: string;
    payload: {
      taskId: string;
    };
  }[],
) => tasks.map((t) => t.title).slice(0, 10);

export const getChoiceFromCommand = (tokens: string[]) => {
  if (tokens.includes(MarusyaUserChoiceVoice.end)) {
    return MarusyaUserChoice.end;
  }
  if (tokens.includes(MarusyaUserChoiceVoice.description)) {
    return MarusyaUserChoice.description;
  }
  if (tokens.includes(MarusyaUserChoiceVoice.name)) {
    return MarusyaUserChoice.name;
  }
  if (tokens.includes(MarusyaUserChoiceVoice.time)) {
    return MarusyaUserChoice.time;
  }
  return '';
};

export const parseTime = (time: string, tokens: string[]) => {
  moment.locale('ru');
  if (moment(time, 'DD.MM').isValid()) {
    return moment(time, 'DD.MM').format();
  }

  const index = tokens.indexOf(
    tokens.find((v) => moment.weekdays().includes(v)) ?? '',
  );
  const index2 = tokens.indexOf(
    tokens.find((v) => moment.weekdaysShort().includes(v)) ?? '',
  );
  const index3 = tokens.indexOf(
    tokens.find((v) => moment.weekdaysMin().includes(v)) ?? '',
  );
  const foundDay = index !== -1 ? tokens[index] : null;
  const foundDay2 = index2 !== -1 ? tokens[index2] : null;
  const foundDay3 = index3 !== -1 ? tokens[index3] : null;

  const day = foundDay ?? foundDay2 ?? foundDay3;

  if (day) {
    const tomorrow = moment().add(1, 'day');
    const dueDate = moment().day(day);
    return isBeforeTomorrow(tomorrow, dueDate)
      ? dueDate.add(1, 'week').format()
      : dueDate.format();
  }

  return 'unknown';
};
