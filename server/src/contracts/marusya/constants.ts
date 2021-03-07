import { MarusyaTaskState, MarusyaUserChoise } from './commands';
import { MarusyaButton, MarusyaCards } from './dto';
import * as moment from 'moment';

export const MarusyaResponseTxt = {
  noUser:
    'Похоже, что для Вас у меня есть отличное приложение. Stuff послужит Вам прекрасным приложением для создания задач.',
  noCommands:
    'Похоже, что по Вашему запросу у меня есть отличное приложение Stuff.',
  askTaskName: 'Какую задачу Вы хотите создать?',
  taskNameLong: 'Название слишком длинное. Попробуйте выбрать другое.',
  wantsMore: 'Я создала задачу. Хотите что-то ещё добавить или изменить?',
  wantsChangeDone: 'Сделано. Хотите ещё что-то изменить?',
  wantsChangeReady: 'Готово. Хотите ещё что-то изменить?',
  listen: 'Слушаю вас',
  time: 'Укажите дату или день недели.',
  wrongTime: 'Я не понимаю. Попробуйте изменить дату или день недели.',
  error:
    'Кажется я что-то не поняла... Но Вы всегда можете доделать то, что начали в приложении Stuff.',
  tasks: 'Вот список Ваших задач.',
  noTasks: 'Кажется у меня нет Ваших задач.',
  taskCreated: (
    task: string,
    time: Date | null,
    taskState: MarusyaTaskState,
  ) => {
    const state =
      taskState === MarusyaTaskState.create ? 'создана' : 'обновлена';
    let res = `Задача "${task}" ${state}.`;
    if (time) {
      moment.locale('ru');
      res += ` Необходимо её закончить до ${moment(time).format(
        'Do MMMM YYYY',
      )}.`;
    }
    return `${res}\nВы можете управлять своими задачами прямо в прлижении Stuff`;
  },
  taskFound: (task: string, time: Date | null, desc: string | null) => {
    let res = `Задача - "${task}".\n`;
    if (time) {
      moment.locale('ru');
      res += `Крайний срок до ${moment(time).format('Do MMMM YYYY')}.\n`;
    }
    if (desc) {
      res += `Подробное описание - ${desc}.\n`;
    }
    return `${res}Хотите что-то изменить?`;
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
      title: 'Название',
      payload: {
        choise: MarusyaUserChoise.name,
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
