// custom-autocomplete.component.ts
import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StringUtils } from '@aratech/utils/stringUtils';
import _ from 'lodash';

@Component({
    selector: 'ara-autocomplete',
    templateUrl: './ara-autocomplete.component.html',
    styleUrls: ['./ara-autocomplete.component.scss'],
    standalone: true,
    imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        CommonModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AraAutocompleteComponent),
            multi: true,
        },
    ],
})
export class AraAutocompleteComponent
    implements ControlValueAccessor, OnInit, OnChanges
{
    @Input() displayField: string[] = ['name']; //Có thể show từ 1 đến 2 filed trong option
    @Input() valueField: 'obj' | 'id' = 'id'; // obj: khi bind dữ liệu sẽ  trả ra hết data của bản ghi

    @Input() placeholder: string = '';
    @Input() label: string = ''; //Auto placeholder khi điền label
    @Input() labelForm: boolean = false;
    @Input() labelPrefix: string = ''; //Điền name field cần hiển thi

    @Input() disabled: boolean = false;
    @Input() items: any[] = []; //Truyền thẳng data từ ngoài vào các propName theo displayField và valueField

    @Input() isShowCount: boolean = true; //Hiện thị bộ đếm ở placeholder
    @Input() isFirstLoad: boolean = true; //Khi truyền services có muốn load dữ liệu khi init compoment hay ko ?
    @Input() isFuseStyle: boolean = true;
    @Input() isRemoveHint: boolean = true; //Xóa bỏ khoảng cách ở dưới mỗi controls
    @Input() isUseForm: boolean = true; //Mặc định sẽ bind được vào form qua formControlName, nếu ko sử dụng thì false sử dụng onChange để bind data
    @Input() isHighlight: boolean = false; //Bôi đỏ ô chọn khi chưa chọn dùng khi là độc lập không có form
    @Input() isTranslate: boolean = false; //Dùng khi muốn đa ngôn ngữ tên option. hãy để name là MsgCode của file dịch vd: Common.Ok, ....

    @Input() showClear: boolean = true; //Mặc định hiển thị nút Clear data

    @Input() panelWidth: string | number; // Độ rộng của menu options
    @Input() refreshFn: () => Promise<void>; //tạo 1 biến = funtion truyền từ component gọi nó để có thể refresh data
    @Input() searchFn: () => Promise<void>; //tạo 1 biến = funtion truyền từ component gọi nó để có thể lấy data
    @Input() dynamicOptionTemplate: TemplateRef<any>;

    @Input() services: any; //Truyền services để call api lấy data yêu cầu theo BaseServices Aratech
    @Input() params: any = {}; //Tham số của API service truyền vào là 1 object

    @Input() value: string = ''; //Value của input search
    @Input() required: boolean = false; //Tham số cho biết đây là trường bắt buộc

    @Output() onChange: EventEmitter<any> = new EventEmitter<any>(); //Event sự thay đổi có thể sử dụng cả trong form và ngoài form
    @Output() onClear: EventEmitter<any> = new EventEmitter<any>(); //Event khi bấn nút clear data

    onSelectChange: (item: any) => void;
    onSelectTouch: (isTouch: boolean) => void;

    copyItems: any[] = [];
    valueEmpty = this.valueField === 'id' ? '' : {};

    //Pagination
    pageIndex: number = 1;
    pageSize: number = 99999;

    @ViewChild('auto') refMatAutocomplete: MatAutocomplete;
    @ViewChild('inputAutoComplete')
    inputAutoComplete: ElementRef<HTMLInputElement>;
    mainControl = new FormControl('');

    get currentOptionSelected() {
        return this.refMatAutocomplete.options.find((f) => f.selected)?.value;
    }

    constructor() // private translate: TranslatePipe,
    // private translateService: TranslateService
    {}

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (this.isFirstLoad) {
            await this.fetchData();
        } else if (changes?.params && !changes?.params.firstChange) {
            await this.fetchData();
        }
        if (changes?.disabled) {
            if (changes.disabled.currentValue) this.mainControl.disable();
            else this.mainControl.enable();
        }
        if (changes?.items) {
            this.copyItems = this.items;
            this.inputAutoComplete.nativeElement.value = '';
        }
        if (changes.value && !this.isUseForm) {
            let option = this.refMatAutocomplete.options.find(
                (f) => f.value.id === changes.value?.currentValue
            );
            if (option) {
                this.mainControl.setValue(option.value);
            } else {
                this.refMatAutocomplete.options
                    .filter((f) => f.selected)
                    .forEach((item) => item.deselect());
                this.refMatAutocomplete.closed.emit();
                this.inputAutoComplete.nativeElement.value = '';
                this.value = '';
                this.mainControl.setValue('');
                if (this.isUseForm) {
                    this.onSelectChange(this.valueEmpty);
                    this.onSelectTouch(false);
                }
                this.items = this.copyItems;
            }
        }
    }

    ngOnInit() {
        // if (this.isTranslate) {
        //     this.translateService.onLangChange.subscribe(() => {
        //         const displayFieldOne =
        //             this.mainControl.getRawValue()[this.displayField[0]];
        //         this.inputAutoComplete.nativeElement.value =
        //             this.translate.transform(displayFieldOne);
        //     });
        // }
    }

    async fetchData() {
        if (
            this.services &&
            this.params &&
            Object.keys(this.params).length > 0
        ) {
            const resp = await this.services.getAsync(
                this.params,
                this.pageIndex,
                this.pageSize,
                { [this.displayField[0]]: 'desc' }
            );
            this.items = resp?.data ?? [];
            this.copyItems = resp?.data ?? [];
            return;
        }
    }

    clear() {
        this.refMatAutocomplete.options
            .filter((f) => f.selected)
            .forEach((item) => item.deselect());
        this.refMatAutocomplete.closed.emit();
        this.inputAutoComplete.nativeElement.value = '';
        this.value = '';
        this.mainControl.setValue('');
        if (this.isUseForm) {
            this.onSelectChange(this.valueEmpty);
            this.onSelectTouch(false);
        }
        this.onChange.emit(this.valueEmpty);
        this.onClear.emit();
        this.items = this.copyItems;
    }

    displayPlaceholder = () => {
        // let placeholder = !StringUtils.isNullOrEmpty(this.placeholder)
        //     ? this.placeholder
        //     : `${this.translate.transform('Common.Select')} ${this.label.toLowerCase()}`;
        let placeholder = !StringUtils.isNullOrEmpty(this.placeholder)
            ? this.placeholder
            : `${this.label.toLowerCase()}`;
        return !this.isShowCount
            ? placeholder
            : `${placeholder} (${this.items.length})`;
    };

    displayWith = (value: any) => {
        const mapperValue =
            typeof value === 'string'
                ? (this.copyItems.find((_) => _['id'] === value) ?? {})
                : value;
        if (!mapperValue || Object.keys(mapperValue).length < 1) return '';

        // if (this.isTranslate) {
        //     return this.labelPrefix.length > 0
        //         ? `${this.translate.transform(mapperValue[this.displayField[0]])} (${this.translate.transform(
        //               mapperValue[this.labelPrefix]
        //           )})`
        //         : this.translate.transform(mapperValue[this.displayField[0]]);
        // }

        return this.labelPrefix.length > 0
            ? `${mapperValue[this.displayField[0]]} (${mapperValue[this.labelPrefix]})`
            : mapperValue[this.displayField[0]];
    };

    optionSelected(event: MatAutocompleteSelectedEvent) {
        if (this.valueField === 'obj') {
            if (this.isUseForm) {
                this.onSelectChange(event.option.value);
            }
            this.onChange.emit(event.option.value);
            return;
        }
        if (this.isUseForm) {
            this.onSelectChange(event.option.value[this.valueField]);
            this.onSelectTouch(true);
        }
        this.onChange.emit(event.option.value[this.valueField]);
    }

    inputChange = _.debounce((event: any) => {
        const value = (event.target.value ?? '').trim().toLowerCase();
        this.items = this.copyItems.filter((f) => {
            if (this.displayField.length > 1) {
                return (
                    f[this.displayField[0]].toLowerCase().includes(value) ||
                    f[this.displayField[1]].toLowerCase().includes(value)
                );
            }
            return f[this.displayField[0]].toLowerCase().includes(value);
        });
    }, 200);

    registerOnChange(fn: any): void {
        this.onSelectChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onSelectTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(valueId: any): void {
        const mapperValue =
            this.copyItems.find((_) => _['id'] === valueId) ?? {};
        this.mainControl.setValue(mapperValue);
        this.value = valueId ?? '';
    }
}
