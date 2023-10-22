import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isBetween);

export function getFormattedDate(inputDate: Date) {
  const date = dayjs(inputDate);
  const today = dayjs();
  const aWeekAgo = dayjs().subtract(7, 'day');

  if (date.isToday()) {
    return 'Today';
  }

  if (date.isYesterday()) {
    return 'Yesterday';
  }

  if (date.isBetween(aWeekAgo, today)) {
    return `${today.diff(date, 'day')} days ago`;
  }

  return date.format('DD MMM');
}
