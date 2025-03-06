import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable, of, switchMap, timer } from 'rxjs';

import { StringUtils } from './stringUtils';

interface AraValidationResult {
  [key: string]: boolean;
}

export class AraValidators {
  private static valueIsNullOrEmpty(control: FormControl) {
    return control.value && control.value === '';
  }

  static timeFormatReg = /^([0-9]{2})([\:]{0,1})([0-9]{2})$/;

  static timeFormat(control: FormControl): AraValidationResult {
    if (this.valueIsNullOrEmpty(control)) return null;
    if (AraValidators.timeFormatReg.test(control.value) == false) {
      return { timeFormat: true };
    } else {
      const value = control.value.replace(':', '');
      const hour = parseInt(value.substr(0, 2));
      const minute = parseInt(value.substr(2, 2));

      if (!(0 <= hour && hour <= 23 && 0 <= minute && minute <= 59)) {
        return { timeFormat: true };
      }
    }
  }

  static momentValidator(control: FormControl): AraValidationResult {
    if (!control.value) return { dateCheck: true };
  }

  static momentValidatorUnique(
    control: FormControl,
    list: any
  ): AraValidationResult {
    if (!control.value) return { Unique: true };
    if (control.value && list) {
      list.filter(value => {
        if (control.value === value) return { Unique: true };
      });
      return { Unique: false };
    }
  }

  static notInteger(control: FormControl): AraValidationResult {
    if (this.valueIsNullOrEmpty(control)) return null;

    if (isNaN(control.value)) return { notInteger: true };

    const val = parseFloat(control.value);
    if (Math.round(val) != val) return { notInteger: true };
  }

  static checkCodeExistsAsync(
    services: any,
    customerId: string,
    oldValue: any
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      const trimValue = control.value?.trim();
      if (
        StringUtils.isNullOrEmpty(trimValue) ||
        StringUtils.compareIgnoreCase(trimValue, oldValue)
      ) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() =>
          services
            .checkCodeExists(trimValue, customerId)
            .pipe(map((exists: any) => (exists ? { exists: true } : null)))
        )
      );
    };
  }
}
