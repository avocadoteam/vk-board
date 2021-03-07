import { MarusyaUserChoise } from './commands';
import { MarusyaButton, MarusyaCards } from './dto';
import * as moment from 'moment';

export const MarusyaResponseTxt = {
  noUser:
    'Похоже, что для Вас у меня есть отличное приложение. Stuff послужит Вам прекрасным приложением для создания задач.',
  askTaskName: 'Какую задачу Вы хотите создать?',
  taskNameLong: 'Название слишком длинное. Попробуйте выбрать другое.',
  wantsMore: 'Я создала задачу. Хотите что-то еще добавить?',
  wantsChangeDone: 'Сделано. Хотите что-то изменить?',
  wantsChangeReady: 'Готово. Хотите что-то изменить?',
  listen: 'Слушаю вас',
  time: 'Укажите дату или день?',
  wrongTime: 'Я не понимаю. Попробуйте изменить дату или день.',
  error:
    'Кажется я сломалась... Но Вы всегда можете использовать приложение Stuff.',
  tasks: 'Вот список Ваших задач.',
  noTasks: 'Кажется у меня нет Ваших задач.',
  taskCreated: (task: string, time: Date | null) => {
    let res = `Задача "${task}" создана.`;
    if (time) {
      moment.locale('ru');
      res += ` Необходимо её закончить до ${moment(time).format(
        'MMMM Do YYYY',
      )}.`;
    }
    return `${res} Вы можете управлять своими задачами прямо в прлижении Stuff`;
  },
};

type CardKey = 'stuff';

export const marusyaCards: Record<CardKey, MarusyaCards> = {
  stuff: {
    type: 'MiniApp',
    url: 'https://vk.com/app7566928',
  },
};

type MarusyaButtons = {
  choise: MarusyaButton[];
  weekDays: () => MarusyaButton[];
};
export const marusyaButtons: MarusyaButtons = {
  choise: [
    {
      title: 'Описание',
      payload: {
        choise: MarusyaUserChoise.description,
      },
    },
    {
      title: 'Время',
      payload: {
        choise: MarusyaUserChoise.time,
      },
    },
    {
      title: 'Нет',
      payload: {
        choise: MarusyaUserChoise.end,
      },
    },
  ],
  weekDays: () => {
    moment.locale('ru');

    const weekDays = moment.weekdaysMin();
    weekDays.shift();
    return weekDays.map((wd) => ({
      title: wd,
      payload: {
        date: moment().day(wd).format('YYYY-MM-DD'),
      },
    }));
  },
};
