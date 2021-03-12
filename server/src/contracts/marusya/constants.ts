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
  askTaskNameFinish: 'Какую задачу Вы хотите завершить?',
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
  bye: 'Работа с задачами завершена',
  foundTasksToFinish:
    'Я не нашла задачу. Может вы хотели завершить одну из этих?',
  taskFinished: (task: string) => `Задача "${task}" завершена.`,
  noTasks: 'Кажется у меня нет Ваших задач.',
  noTask: 'Такой задачи нет',
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
