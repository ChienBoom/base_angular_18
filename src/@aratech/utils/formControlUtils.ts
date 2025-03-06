import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';

import { AraValidators } from './validators';

export class FormControlUtils {
  static processFormValueChange(form: FormGroup, formErrors: any) {
    for (const field in formErrors) {
      if (!formErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      formErrors[field] = {};

      // Get the control
      const control = form.get(field);

      if (control && control.dirty && !control.valid && !control.pending) {
        formErrors[field] = control.errors ? control.errors : {};
      }
    }
  }

  static onFormValueChange(form: FormGroup, formErrors: any) {
    Object.keys(form.controls).forEach(key => {
      formErrors[key] = {};
    });
    form.valueChanges.subscribe(() => {
      FormControlUtils.processFormValueChange(form, formErrors);
    });
  }

  static FormInitControls = Object.assign(
    {},
    {
      DateRange: () =>
        new FormGroup({
          start: new FormControl(moment().clone(), [
            AraValidators.momentValidator,
          ]),
          end: new FormControl(moment().clone(), [
            AraValidators.momentValidator,
          ]),
        }),
      DateRangeNextYear: () =>
        new FormGroup({
          start: new FormControl(moment().clone().subtract(1, 'years'), [
            AraValidators.momentValidator,
          ]),
          end: new FormControl(moment().clone(), [
            AraValidators.momentValidator,
          ]),
        }),
      DateRangeStartEnd: (startDate, endDate) =>
        new FormGroup({
          start: new FormControl(startDate ? moment(startDate) : moment().clone(), [
            AraValidators.momentValidator,
          ]),
          end: new FormControl(endDate ? moment(endDate) : moment().clone(), [
            AraValidators.momentValidator,
          ]),
        }),
    }
  );

  static disableAllControl(formGroup: FormGroup, isDisable = true) {
    for (const control in formGroup.controls) {
      if (isDisable) {
        formGroup.controls[control].disable();
        continue;
      }
      formGroup.controls[control].enable();
    }
  }
}
