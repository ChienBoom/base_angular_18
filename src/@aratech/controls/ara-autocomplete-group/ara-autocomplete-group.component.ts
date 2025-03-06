import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import _ from 'lodash';
import { debounceTime } from 'rxjs';

export interface StateGroup {
  groupName: string;
  items: any[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
    selector: 'ara-autocomplete-group',
    templateUrl: './ara-autocomplete-group.component.html',
    styleUrls: ['./ara-autocomplete-group.component.scss'],
    standalone: true,
    imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AraAutocompleteGroupComponent,
            multi: true,
        },
    ],
})
export class AraAutocompleteGroupComponent
    implements OnInit, ControlValueAccessor
{
    @Input() items: any[] = [];
    @Input() valueField = 'value';
    @Input() displayField = 'value';
    @Input() displayField2 = 'value';
    @Input() groupField = 'text';
    @Input() label: string;
    @Input() ngModel: any;
    @Input() model: any;
    @Input() disable = false;
    @Input() required = false;
    @Input() group: FormGroup;

    @Output() onChange: EventEmitter<any> = new EventEmitter();
    onSelectChange: (item: any) => void;
    onSelectTouch: (isTouch: boolean) => void;
    errors: any = {};
    selectedItem: any;

    stateForm = this.fb.group({
        stateGroup: ['', this.required ? Validators.required : null], // Include Validators.required if 'required' is true
    });
    displayFn(item: any): string {
        return item && item.name ? item.name : '';
    }

    stateGroupOptions: StateGroup[];

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        if (this.disable) {
            this.stateForm.disable();
        }

        this.stateForm.valueChanges
            .pipe(debounceTime(300))
            .subscribe((value) => {
                let dataSearch = [];
                if (
                    value['stateGroup'] &&
                    typeof value['stateGroup'] === 'string'
                ) {
                    const searchValue = value['stateGroup']
                        .trim()
                        .toLowerCase();
                    dataSearch = this.items.filter(
                        (item) =>
                            item?.name?.toLowerCase().includes(searchValue) ||
                            item?.code?.toLowerCase().includes(searchValue)
                    );
                } else {
                    dataSearch = this.items;
                }
                this.stateGroupOptions = this.groupData(dataSearch);
            });

        this.stateForm.get('stateGroup').statusChanges.subscribe((status) => {
            this.errors.required = status === 'INVALID';
        });
    }

    groupData(dataSource: any): StateGroup[] {
        if (dataSource?.length < 1) {
            return [];
        }

        const groups = _.toPairs(
            _.groupBy(dataSource, (item) => _.get(item, this.groupField))
        ).map((group) => ({
            groupName: group[0],
            items: group[1],
        }));
        return groups;
    }

    optionSelected(event: MatAutocompleteSelectedEvent) {
        const selectedValue =
            this.valueField === 'obj'
                ? event.option.value
                : event.option.value[this.valueField];
        this.onSelectChange(selectedValue);
        this.onChange.emit(selectedValue);
        this.onSelectTouch(true);
        this.stateForm
            .get('stateGroup')
            .setValue(event.option.value, { emitEvent: false });
    }

    onInputChange(value: string) {
        this.onChange.emit(this.selectedItem?.id);
    }

    clear() {
        this.selectedItem = undefined;
        this.stateForm.get('stateGroup').setValue('', { emitEvent: false });
        this.onSelectChange(null);
        this.onChange.emit(null);
    }

    registerOnChange(fn: any): void {
        this.onSelectChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onSelectTouch = fn;
    }

    writeValue(obj: any): void {
        if (obj) {
            this.selectedItem = this.items.find(
                (item) => item[this.valueField] === obj
            );
            if (this.selectedItem) {
                this.stateForm
                    .get('stateGroup')
                    .setValue(this.selectedItem, { emitEvent: false });
            }
        } else {
            this.stateForm.get('stateGroup').setValue('', { emitEvent: false });
        }
    }
}
