import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlUtils } from '../../utils/formControlUtils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'ara-daterange',
    templateUrl: './ara-daterange.component.html',
    styleUrls: ['./ara-daterange.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatDatepickerModule
    ],
})
export class AraDateRangeComponent implements OnInit {
    @Input() formGroup: FormGroup | null = null;
    @Input() disable = false;
    @Input() isCheckFuture = true;
    @Input() isCheckPast = false;
    @Input() label = '';
    @Input() required = false;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

    defaultFormGroup: FormGroup = FormControlUtils.FormInitControls.DateRange();

    get getStartDate() {
        return this.defaultFormGroup.get('start');
    }

    get getEndDate() {
        return this.defaultFormGroup.get('end');
    }

    ngOnInit(): void {
        if (this.formGroup) this.defaultFormGroup = this.formGroup;
    }

    filterPicker = (momentDate: moment.Moment | null): boolean => {
        if (!momentDate) return true;
        const dateNow = moment().clone();
        if (this.isCheckFuture) return momentDate < dateNow;
        if (this.isCheckPast) return momentDate > dateNow;
        return true;
    };

    handleOnChange(): void {
        this.onChange.emit(this.defaultFormGroup?.value ?? {});
    }
}
