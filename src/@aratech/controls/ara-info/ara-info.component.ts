import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateTimeUtils } from '@aratech/utils/dateTimeUtils';

@Component({
    selector: 'ara-info',
    templateUrl: './ara-info.component.html',
    styleUrls: ['./ara-info.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        CommonModule,
        MatInputModule,
    ],
})
export class AraInfoComponent implements OnInit, OnChanges {
    @Input() label: string;
    @Input() ngModel: string;
    @Input() textarea = false;
    dataType = 0;
    types = {
        text: 0,
        number: 1,
        date: 2,
        textarea: 3,
    };
    value: any;

    constructor() {}

    ngOnInit() {
        this.value = this.ngModel;
        if (this.textarea) {
            this.dataType = this.types.textarea;
        } else if (DateTimeUtils.isDateType(this.ngModel)) {
            this.dataType = this.types.date;
        } else if (typeof this.ngModel == 'number') {
            this.dataType = this.types.number;
        } else {
            this.dataType = this.types.text;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.ngModel) {
            this.ngOnInit();
        }
    }
}
