import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  MatChipEditedEvent,
  MatChipGridChange,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'ara-chips',
    templateUrl: './ara-chips.component.html',
    styleUrls: ['./ara-chips.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        ReactiveFormsModule,
        MatChipsModule
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraChipsComponent,
            multi: true,
        },
    ],
})
export class AraChipsComponent implements ControlValueAccessor {
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    addOnBlur = true;
    chips: string[] = [];
    @Input() disabled = false;
    @Input() isHint = false;
    @Input() isCopyBtn = true;
    @Input() isDelBtn = true;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClear: EventEmitter<any> = new EventEmitter<any>();

    onChangeForm: (item: any) => void;
    onTouchForm: (isTouch: boolean) => void;

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            this.chips.push(value);
        }
        event.chipInput!.clear();
    }

    remove(value: string): void {
        const index = this.chips.indexOf(value);

        if (index >= 0) {
            this.chips.splice(index, 1);
        }
    }

    edit(item: string, event: MatChipEditedEvent) {
        const value = event.value.trim();
        if (!value) {
            this.remove(item);
            return;
        }
        const index = this.chips.indexOf(item);
        if (index >= 0) {
            this.chips[index] = value;
        }
    }

    paste(event: ClipboardEvent): void {
        event.preventDefault();
        event.clipboardData
            .getData('Text')
            .split(/[;,\n]/)
            .forEach((value) => {
                if (value.trim()) {
                    this.chips.push(value.trim());
                }
            });
    }

    onClearChips() {
        this.chips = [];
        this.onChangeForm([]);
        this.onTouchForm(false);
        this.onChange.emit([]);
        this.onClear.emit();
    }

    onChipsChange(event: MatChipGridChange) {
        this.onChangeForm(event.value);
        this.onTouchForm(true);
        this.onChange.emit(event.value);
    }

    writeValue(obj: any): void {
        this.chips = obj;
    }

    registerOnChange(fn: any): void {
        this.onChangeForm = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchForm = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
