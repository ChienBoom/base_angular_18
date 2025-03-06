import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[dateInput]',
  host: { maxlength: '12' },
})
export class DateInputDirective {
  timeFormat = /^([0-9]{2})([\/]{0,1})([0-9]{2})([\/]{0,1})([0-9]{2})$/;
  _el: ElementRef;

  constructor(el: ElementRef) {
    this._el = el;
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9\/]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('blur', ['$event.target', '$event.target.value'])
  onBlur(el: any, value: string): void {
    if (value) {
    }
  }
}
