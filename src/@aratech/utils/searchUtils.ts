import moment from 'moment';

import { DateTimeUtils } from './dateTimeUtils';

export class SearchUtils {
  /**
   * Xử lý ra Param tìm kiếm ngày tháng theo Base Aratech BE
   * @constructor
   * @param {moment.Moment} startDateMoment - Đầu vào bắt buộc là 1 moment
   * @param {moment.Moment} endDateMoment - Đầu vào bắt buộc là 1 moment
   * @param {string} dateFieldName - Tên trường ngày giờ cần search
   */
  static getDateParam(
    startDateMoment: moment.Moment,
    endDateMoment?: moment.Moment,
    dateFieldName = ''
  ): any {
    if (dateFieldName === '') return {};
    if (!startDateMoment) return {};
    const startDate = startDateMoment.startOf('days').toISOString();
    if (!endDateMoment)
      return { [dateFieldName]: `(${startDate},${startDate})` };
    const endDate = endDateMoment.endOf('days').toISOString();
    return { [dateFieldName]: `(${startDate},${endDate})` };
  }

  static getSortVietnamese = (
    data: any[],
    fieldName: string,
    isAsc: boolean
  ): any[] => {
    const copyData = [...data];
    return copyData.sort((a, b) => {
      let compareResult: number;
      if (
        typeof a[fieldName] === 'string' &&
        typeof b[fieldName] === 'string'
      ) {
        compareResult = a[fieldName]?.localeCompare(b[fieldName], 'vi-VN');
        if (a[fieldName] === '' && b[fieldName] !== '') {
          compareResult = isAsc ? 1 : -1;
        }
        if (a[fieldName] !== '' && b[fieldName] === '') {
          compareResult = isAsc ? -1 : 1;
        }
      } else {
        compareResult = Number(a[fieldName]) - Number(b[fieldName]);
      }
      return isAsc ? compareResult : -compareResult;
    });
  };
}
