import { utcToZonedTime, format } from 'date-fns-tz';
import { ru } from 'date-fns/locale';

export const timeBasedOnTz = (datetime: string | Date) => {
  const date = new Date(datetime);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = utcToZonedTime(date, timeZone);

  return format(zonedDate, 'dd MMMM', { locale: ru, timeZone });
};
