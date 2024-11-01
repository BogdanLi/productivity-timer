import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(calendar);

export const formatDateTime = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

export const formatRelativeTime = (date: string) => {
  return dayjs(date).fromNow();
};

export const formatCalendar = (date: string) => {
  return dayjs(date).calendar();
};

export const getStartOfDay = () => {
  return dayjs().startOf('day').toISOString();
};

export const getStartOfWeek = () => {
  return dayjs().subtract(7, 'day').startOf('day').toISOString();
};

export const isDateInRange = (date: string, start: string, end: string) => {
  const dateObj = dayjs(date);
  return dateObj.isAfter(start) && dateObj.isBefore(dayjs(end).endOf('day'));
};
