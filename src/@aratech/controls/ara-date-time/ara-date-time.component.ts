import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import dayjs from 'dayjs';

const CUSTOM_TIME_FORMATS = {
    parse: {
        dateInput: 'dd/MM/yyyy HH:mm:ss',
    },
    display: {
        dateInput: 'dd/MM/yyyy HH:mm:ss',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'ara-date-time',
    templateUrl: './ara-date-time.component.html',
    styleUrls: ['./ara-date-time.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, CommonModule, MatInputModule, MatIconModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraDateTimePickerV2Component,
            multi: true,
        },
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_TIME_FORMATS },
    ],
})
export class AraDateTimePickerV2Component
    implements OnInit, ControlValueAccessor
{
    @Input() value: string = dayjs().format('DD/MM/YYYY HH:mm:ss');
    @Input() disabled: boolean = false;

    onChangeTime: (value: any) => void = () => {};
    onTouchTime: (touch: boolean) => void = () => {};

    ngOnInit(): void {
        console.log('value: ', this.value);
    }

    onChangeValue(event: any) {
        console.log('event: ', event);
        this.onChangeTime(event.target.value);
        this.onTouchTime(true);
    }

    openDateTimePicker(dateTimeInput: HTMLInputElement) {
        dateTimeInput.focus();
    }

    registerOnChange(fn: any): void {
        this.onChangeTime = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchTime = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
}
