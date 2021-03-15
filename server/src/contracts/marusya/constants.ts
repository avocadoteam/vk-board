import {
  MarusyaTaskState,
  MarusyaUserChoice,
  MarusyaUserWelcomeChoice,
} from './commands';
import { MarusyaButton, MarusyaCards } from './dto';
import * as moment from 'moment';

export const MarusyaResponseTxt = {
  welcome:
    'Я могу помочь с организацией Ваших задач. Для этого выберете то, что Вы хотите сделать: создать задачу, завершить задачу или посмотреть список задач.',
  noUser:
    'Похоже, что для Вас у меня есть отличное приложение. Stuff послужит Вам прекрасным приложением для создания задач.',
  noCommands:
    'Похоже, что по Вашему запросу у меня есть отличное приложение Stuff.',
  askTaskName: 'Какую задачу Вы хотите создать?',
  askTaskNameFinish: (taskNames: string[]) => `Какую задачу Вы хотите завершить?\n${taskNames.join('.\n')}`,
  taskNameLong: 'Название слишком длинное. Попробуйте выбрать другое.',
  wantsMore:
    'Я создала задачу. Хотите добавить описание, время или изменить название?',
  wantsChangeDone: 'Сделано. Хотите изменить описание, время или название?',
  wantsChangeReady: 'Готово. Хотите изменить описание, время или название?',
  listen: 'Слушаю вас',
  time: 'Укажите дату или день недели.',
  wrongTime: 'Я не понимаю. Попробуйте изменить дату или день недели.',
  error:
    'Кажется я что-то не поняла... Но Вы всегда можете доделать то, что начали в приложении Stuff.',
  tasks: (taskNames: string[]) =>
    `Вот список Ваших задач.\n${taskNames.join('.\n')}`,
  bye:
    'Работа с задачами завершена. Но Вы всегда можете доделать то, что начали в приложении Stuff.',
  notFoundTaskButHasMoreTasks: (search: string, taskNames: string[]) =>
    `Я не нашла задачу "${search}". Может быть Вы имели в виду одну из этих?\n${taskNames.join(
      '.\n',
    )}`,
  taskFinished: (task: string) => `Задача "${task}" завершена.`,
  noTasks: 'Кажется у меня нет Ваших задач. Хотите создать задачу?',
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
    return `${res}\nВы можете управлять своими задачами прямо в приложении Stuff`;
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
    return `${res}Хотите изменить описание, время или название?`;
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
  choice: MarusyaButton[];
  welcome: MarusyaButton[];
  weekDays: () => MarusyaButton[];
};
export const marusyaButtons: MarusyaButtons = {
  choice: [
    {
      title: 'Описание',
      payload: {
        choice: MarusyaUserChoice.description,
      },
    },
    {
      title: 'Время',
      payload: {
        choice: MarusyaUserChoice.time,
      },
    },
    {
      title: 'Название',
      payload: {
        choice: MarusyaUserChoice.name,
      },
    },
    {
      title: 'Нет',
      payload: {
        choice: MarusyaUserChoice.end,
      },
    },
  ],
  weekDays: () => {
    moment.locale('ru');

    const weekDays = moment.weekdaysMin();
    weekDays.shift();
    return weekDays
      .map((wd) => {
        const tomorrow = moment().add(1, 'day');
        const dueDate = moment().day(wd);
        return {
          title: wd,
          payload: {
            date: isBeforeTomorrow(tomorrow, dueDate)
              ? dueDate.add(1, 'week').format('YYYY-MM-DD')
              : dueDate.format('YYYY-MM-DD'),
          },
        };
      })
      .sort((a, b) =>
        moment(a.payload.date).isAfter(b.payload.date) ? 1 : -1,
      );
  },
  welcome: [
    {
      title: 'Создать задачу',
      payload: {
        welcome: MarusyaUserWelcomeChoice.create,
      },
    },
    {
      title: 'Завершить задачу',
      payload: {
        welcome: MarusyaUserWelcomeChoice.end,
      },
    },
    {
      title: 'Список задач',
      payload: {
        welcome: MarusyaUserWelcomeChoice.list,
      },
    },
  ],
};

export const isBeforeTomorrow = (
  tomorrow: moment.Moment,
  dueDate: moment.Moment,
) => moment(dueDate).isBefore(tomorrow, 'day');
