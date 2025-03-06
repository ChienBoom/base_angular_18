import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import dayjs from 'dayjs';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'ara-date',
    templateUrl: './ara-date.component.html',
    styleUrls: ['./ara-date.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        MatDatepickerModule,
        MatInputModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraDateV2Component,
            multi: true,
        },
    ],
})
export class AraDateV2Component implements ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() disabled: boolean = false;
    @Input() value: any;
    @Input() label: string;
    @Input() isCheckFuture: boolean = true;
    @Input() isCheckPast: boolean = false;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    onDateChange: (value: any) => void;
    onDateTouch: (value: boolean) => void;

    constructor() {}

    handleDateChange(event: any) {
        this.onDateChange(event.value);
        this.onDateTouch(true);
        this.onChange.emit(event.value);
    }

    filterPicker = (date: dayjs.Dayjs | null): boolean => {
        if (!date) return true;
        const dateNow = dayjs();

        if (this.isCheckFuture) return date.isBefore(dateNow);
        if (this.isCheckPast) return date.isAfter(dateNow);

        return true;
    };

    registerOnTouched(fn: any): void {
        this.onDateTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnChange(fn: any): void {
        this.onDateChange = fn;
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
}
