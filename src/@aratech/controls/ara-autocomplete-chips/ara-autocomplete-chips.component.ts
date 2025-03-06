import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipGridChange, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StringUtils } from '@aratech/utils/stringUtils';
import { map, Observable, startWith } from 'rxjs';

@Component({
    selector: 'ara-autocomplete-chips',
    templateUrl: './ara-autocomplete-chips.component.html',
    styleUrls: ['./ara-autocomplete-chips.component.scss'],
    standalone: true,
    imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        CommonModule,
        MatChipsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraAutocompleteChipsComponent,
            multi: true,
        },
    ],
})
export class AraAutocompleteChipsComponent implements ControlValueAccessor {
    @Input() items: any[] = []; //Dữ liệu truyền vào list object
    @Input() displayField: string[] = ['name']; //Có thể show từ 1 đến 2 filed trong option
    @Input() valueField = 'id'; // Trả ra 1 list id hoặc full data

    @Input() placeholder = '';
    @Input() label = ''; //Auto placeholder khi điền label
    @Input() labelForm = false;
    @Input() labelPrefix = ''; //Điền tên field cần hiển thi
    @Input() panelWidth: string | number;

    @Input() isUseForm = true; //Mặc định sẽ bind được vào form qua formControlName, nếu ko sử dụng thì false sử dụng onChange để bind data
    @Input() isDelBtn = true;
    @Input() isHint = false;
    @Input() isFuseStyle = true;
    @Input() isShowCount = true; //Hiện thị bộ đếm ở placeholder
    @Input() isDisableAfterSelected = true; //Xóa phần tử trong items sau khi chọn

    @Input() disabled = false;
    @Input() dynamicOptionTemplate: TemplateRef<any>;
    @Input() dynamicChipTemplate: TemplateRef<any>;

    @Output() onChange: EventEmitter<any> = new EventEmitter<any>(); //Event sự thay đổi có thể sử dụng cả trong form và ngoài form
    @Output() onClear: EventEmitter<any> = new EventEmitter<any>(); //Event khi bấn nút clear data
    @Output() onChipsChange: EventEmitter<MatChipGridChange> =
        new EventEmitter<MatChipGridChange>(); //Event khi bấn nút clear data

    inputCtrl = new FormControl('');
    filteredItems: Observable<any[]>;

    chips: any[] = [];

    onChangeForm: (item: any) => void;
    onTouchForm: (isTouch: boolean) => void;

    @ViewChild('refInputSearch') refInputSearch: ElementRef<HTMLInputElement>;
    @ViewChild('auto') refMatAutocomplete: MatAutocomplete;

    constructor() {
        this.filteredItems = this.inputCtrl.valueChanges.pipe(
            startWith(''),
            map((searchTerm: string) =>
                searchTerm ? this._filter(searchTerm) : this.items.slice()
            )
        );
    }

    add(event: MatChipInputEvent): void {
        event.chipInput!.clear();
        this.inputCtrl.setValue('');
    }

    remove(chip: any): void {
        const index = this.chips.indexOf(chip);

        if (index >= 0) {
            this.chips.splice(index, 1);
        }
    }

    onClearChips() {
        this.chips = [];
        this.onChangeForm([]);
        this.onTouchForm(false);
        this.onChange.emit([]);
        this.onClear.emit();
    }

    handleChipsChange(event: MatChipGridChange) {
        this.onChipsChange.emit(event);
    }

    optionSelected(event: MatAutocompleteSelectedEvent): void {
        this.inputCtrl.setValue('');
        this.refInputSearch.nativeElement.value = '';
        this.chips.push(event.option.value);

        this.onChange.emit({
            selectedValue: event.option.value,
            allValue: this.chips,
        });
        this.onChangeForm(this.chips);
        this.onTouchForm(true);
    }

    getDisable(id: string) {
        if (this.isDisableAfterSelected) {
            return this.chips.some((x) => x[this.valueField] === id);
        } else {
            return false;
        }
    }

    displayPlaceholder = () => {
        const placeholder = !StringUtils.isNullOrEmpty(this.placeholder)
            ? this.placeholder
            : `Select ${this.label.toLowerCase()}`;
        return !this.isShowCount
            ? placeholder
            : `${placeholder} (${this.items.length})`;
    };

    private _filter(value: string): any[] {
        if (typeof value !== 'string') return this.items;
        const filterValue = value.toLowerCase();

        return this.items.filter((f: any) => {
            if (this.displayField.length > 1) {
                return (
                    f[this.displayField[0]]
                        .toLowerCase()
                        .includes(filterValue) ||
                    f[this.displayField[1]].toLowerCase().includes(filterValue)
                );
            }
            return f[this.displayField[0]].toLowerCase().includes(filterValue);
        });
    }

    displayWith = (value: any) => {
        return this.labelPrefix.length > 0
            ? `${value[this.displayField[0]]} (${value[this.labelPrefix]})`
            : value[this.displayField[0]];
    };

    //Bind vào form thì chỉ cần truyền 1 list Id là được
    writeValue(listId: any): void {
        const filterId = (listId ?? []).filter(
            (f) => f !== null && f !== undefined
        );
        this.chips = this.items.filter((x) =>
            filterId.some((s) => s === x[this.valueField])
        );
    }

    registerOnChange(fn: any): void {
        this.onChangeForm = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchForm = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
