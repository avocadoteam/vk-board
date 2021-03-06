import { MarusyaCards } from './dto';

export const MarusyaResponseTxt = {
  noUser: [
    'Похоже, что для Вас у меня есть отличное приложение.',
    'Stuff послужит Вам прекрасным приложением для создания задач.',
  ],
  askTaskName: 'Какую задачу Вы хотите создать?',
  taskNameLong: ['Название слишком длинное.', 'Попробуйте выбрать другое.'],
  tasks: 'Вот список Ваших задач.',
  noTasks: 'Кажется у меня нет Ваших задач.',
  taskCreated: (task: string) =>
    `Задача "${task}" создана. Вы можете управлять своими задачами прямо в прлижении Stuff`,
};

type CardKey = 'stuff';

export const marusyaCards: Record<CardKey, MarusyaCards> = {
  stuff: {
    type: 'MiniApp',
    url: 'https://vk.com/app7566928',
  },
};
