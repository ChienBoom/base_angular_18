import * as moment from 'moment';

export class DateTimeUtils {
  static getStartOfDayUTCByMoment(FromDate): moment.Moment {
    FromDate.set('hour', 0);
    FromDate.set('minute', 0);
    FromDate.set('second', 0);
    FromDate.set('millisecond', 0);
    return FromDate.toISOString();
  }

  static getEndOfDayUTCByMoment(ToDate): moment.Moment {
    ToDate.set('hour', 23);
    ToDate.set('minute', 59);
    ToDate.set('second', 59);
    ToDate.set('millisecond', 999);
    return ToDate.toISOString();
  }

  static getStartOfDay(date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  static getEndOfDay(date): Date {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  static getStartOfDayString(date): string {
    if (moment.isMoment(date)) {
      const newDate = moment(date);
      newDate.set('hour', 0);
      newDate.set('minute', 0);
      newDate.set('second', 0);
      newDate.set('millisecond', 0);
      return newDate.toISOString();
    } else if (moment.isDate(date)) {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate.toISOString();
    }
    return date;
  }

  static getEndOfDayString(date): string {
    if (moment.isMoment(date)) {
      const newDate = moment(date);
      newDate.set('hour', 23);
      newDate.set('minute', 59);
      newDate.set('second', 59);
      newDate.set('millisecond', 999);
      return newDate.toISOString();
    } else if (moment.isDate(date)) {
      const newDate = new Date(date);
      newDate.setHours(23, 59, 59, 999);
      return newDate.toISOString();
    }
    return date;
  }

  static getStartOfMonthString(date): string {
    if (moment.isMoment(date)) {
      const newDate = moment(date);
      newDate.startOf('month');
      return newDate.toISOString();
    } else if (moment.isDate(date)) {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return firstDay.toISOString();
    }
    return date;
  }

  static getEndOfMonthString(date): string {
    if (moment.isMoment(date)) {
      const newDate = moment(date);
      newDate.endOf('month');
      return newDate.toISOString();
    } else if (moment.isDate(date)) {
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return lastDay.toISOString();
    }
    return date;
  }

  static getStartOfMonth(date): moment.Moment | Date {
    if (moment.isMoment(date)) {
      const newDate = moment(date);
      newDate.startOf('month');
      return newDate;
    } else if (moment.isDate(date)) {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return firstDay;
    }
    return date;
  }

  static getEndOfMonth(date): moment.Moment | Date {
    if (moment.isMoment(date)) {
      const newDate = moment(date);
      newDate.endOf('month');
      return newDate;
    } else if (moment.isDate(date)) {
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return lastDay;
    }
    return date;
  }

  static isIsoDate(str) {
    return typeof str == 'string' && isNaN(Number(str)) && Date.parse(str);
  }

  static isDateType(date) {
    return (
      moment.isMoment(date) ||
      moment.isDate(date) ||
      DateTimeUtils.isIsoDate(date)
    );
  }

  static daysBetween(fromDate: string, toDate: string) {
    const from = moment(fromDate).clone();
    const to = moment(toDate).clone();
    return to.diff(from, 'days');
  }
}
