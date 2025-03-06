// custom-autocomplete.component.ts
import { AsyncPipe, CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'ara-input-text',
    templateUrl: './ara-input-text.component.html',
    styleUrls: ['./ara-input-text.component.scss'],
    standalone: true,
    imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        CommonModule,
        MatInputModule,
        MatIconModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AraInputTextComponent),
            multi: true,
        },
    ],
})
export class AraInputTextComponent implements ControlValueAccessor {
    @Input() label: string = 'Input text'; //label
    @Input() type: string = 'text'; //loai input
    @Input() placeholder: string = ''; //goi y
    @Input() isUseClear: boolean = false; //su dung button clear de xoa toan bo value
    @Input() required: boolean = false; //la truong bat buoc hay khong
    @Input() isUseForm: boolean = false; // su dung voi FormGroup hay khong
    @Input() formGroup!: FormGroup; //formGroup truong hop su dung FormGroup
    @Input() formControlName: string = ''; //formControlName truong hop su dung FormGroup
    @Input() value: boolean = true; //gia tri autocomplete
    @Input() isDisabled: boolean = false; //disable autocomplete hay khong

    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClear: EventEmitter<any> = new EventEmitter<any>();
    selectedValue: string = '';
    control!: FormControl;
    disabled: boolean = false;

    private onSelectChange: (value: string) => void = () => {};
    private onSelectTouched: () => void = () => {};

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isUseForm) {
            this.control = this.formGroup.get(
                this.formControlName
            ) as FormControl;
        }
        if (changes['value'] && !this.isUseForm) {
            this.writeValue(changes['value'].currentValue);
        }
        if (changes['isDisabled']) {
            if (this.isUseForm) {
                if (changes['isDisabled'].currentValue) {
                    this.control?.disable();
                } else {
                    this.control?.enable();
                }
            } else {
                this.setDisabledState(changes['isDisabled'].currentValue);
            }
        }
    }

    handleClearValue() {
        if (this.isUseForm) {
            this.control.patchValue('');
        } else {
            this.writeValue('');
            this.onClear.emit();
        }
    }

    // Xử lý khi input được focus (click lần đầu)
    handleInputFocus(): void {
        this.onSelectTouched(); // Báo hiệu control đã được tương tác
    }

    handleInputChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.selectedValue = value;
        this.onSelectChange(value);
        this.onChange.emit(value);
        this.onSelectTouched();
    }

    getErrorMessage(): string | null {
        if (this.control?.hasError('required')) {
            return 'control is required';
        }
        if (this.control?.hasError('email')) {
            return 'Invalid control format';
        }
        if (this.control?.hasError('minlength')) {
            return 'control must be at least 6 characters long';
        }

        if (this.control?.hasError('maxlength')) {
            return 'control must be at least 6 characters long';
        }
        if (this.control?.hasError('min')) {
            return 'control is required';
        }
        if (this.control?.hasError('max')) {
            return 'Invalid control format';
        }
        return null;
    }

    writeValue(value: string): void {
        this.selectedValue = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onSelectChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onSelectTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
