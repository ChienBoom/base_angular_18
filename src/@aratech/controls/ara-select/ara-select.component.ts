import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormGroup,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ara-select',
    templateUrl: './ara-select.component.html',
    styleUrls: ['./ara-select.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatSelectModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraSelectV2Component,
            multi: true,
        },
    ],
})
/**
 * AraSelectV2 binding theo formControlName hoặc chạy độc lập không trong form qua onChange
 */
export class AraSelectV2Component
    implements OnInit, OnChanges, ControlValueAccessor, OnDestroy
{
    @Input() displayField: string[] = ['name']; //Có thể show từ 1 đến 2 filed trong option
    @Input() valueField: 'obj' | 'id' = 'id'; // obj: khi bind dữ liệu sẽ  trả ra hết data của bản ghi

    @Input() placeholder: string = '';
    @Input() label: string = ''; //Auto placeholder khi điền label
    @Input() labelForm: boolean = false;
    @Input() labelPrefix: string = ''; //Điền name field cần hiển thi

    @Input() disabled: boolean = false;
    @Input() items: any[] = []; //Truyền thẳng data từ ngoài vào các propName theo displayField và valueField

    @Input() isFuseStyle: boolean = true;
    @Input() isRemoveHint: boolean = true; //Xóa bỏ khoảng cách ở dưới mỗi controls
    @Input() isUseForm: boolean = true; //Mặc định sẽ bind được vào form qua formControlName, nếu ko sử dụng thì false sử dụng onChange để bind data
    @Input() isHighlight: boolean = false; //Bôi đỏ ô chọn khi chưa chọn dùng khi là độc lập không có form
    @Input() isTranslate: boolean = false; //Dùng khi muốn đa ngôn ngữ tên option. hãy để name là MsgCode của file dịch vd: Common.Ok, ....

    @Input() panelWidth: string | number; // Độ rộng của menu options
    @Input() dynamicOptionTemplate: TemplateRef<any>;

    @Input() value: string = ''; //Value của input search
    @Input() multiple: boolean = false; //Lựa chọn 1 hay nhiều option
    @Input() formGroup: FormGroup | undefined; //FormGroup truyền từ ngoài
    @Input() controlName: string = ''; //Tên control

    @Output() onChange: EventEmitter<any> = new EventEmitter<any>(); //Event sự thay đổi có thể sử dụng cả trong form và ngoài form

    onSelectChange: (value: any) => void = () => {};
    onSelectTouch: () => void = () => {};

    private subscription: Subscription;

    mainControl: any = {};

    constructor() // private translate: TranslatePipe,
    // private translateService: TranslateService
    {}

    async ngOnChanges(changes: SimpleChanges): Promise<void> {}

    ngOnInit() {
        // if (this.isTranslate) {
        //     this.subscription = this.translateService.onLangChange.subscribe(
        //         () => {
        //             const displayFieldOne =
        //                 this.mainControl.getRawValue()[this.displayField[0]];
        //         }
        //     );
        // }
        if (this.isUseForm) {
            this.mainControl = this.formGroup?.get(this.controlName);
            this.value = this.mainControl.value;
        }
    }

    optionSelected(event: any) {
        if (this.isUseForm) {
            this.mainControl.setValue(event.value);
            this.onSelectChange(event.value);
        } else {
            this.value = event.value;
            this.onSelectChange(event.value);
            this.onChange.emit(event.value);
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onSelectChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onSelectTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
