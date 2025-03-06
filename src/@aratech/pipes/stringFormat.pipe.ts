import { Pipe, PipeTransform } from '@angular/core';

import { StringUtils } from '../utils/stringUtils';

@Pipe({
  name: 'stringFormat',
})
export class StringFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return StringUtils.format(value, ...args);
  }
}
