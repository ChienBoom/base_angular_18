import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: 'input[timeInput]',
  host: { maxlength: '5' },
})
export class TimeInputDirective {
  timeFormat = /^([0-9]{2})([\:]{0,1})([0-9]{2})$/;
  _el: any;
  @Output() onModelChange = new EventEmitter();

  constructor(el: ElementRef) {
    this._el = el.nativeElement;
  }
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.value;
    this._el.value = initalValue.replace(/[^0-9:]*/g, '');
    if (initalValue !== this._el.value) {
      event.stopPropagation();
    }
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string): void {
    if (value) {
      if (this.timeFormat.test(value) == false) {
        this._el.value = '';
      } else {
        value = value.replace(':', '');
        const hour = parseInt(value.substr(0, 2));
        const minute = parseInt(value.substr(2, 2));

        if (0 <= hour && hour <= 23 && 0 <= minute && minute <= 59) {
          this._el.value = value.substr(0, 2) + ':' + value.substr(2, 2);
        } else {
          this._el.value = '';
        }
      }

      this.onModelChange.emit(this._el.value);
    }
  }
}
