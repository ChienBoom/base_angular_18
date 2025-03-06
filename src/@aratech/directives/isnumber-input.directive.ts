import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[isNumberInput]',
  host: { maxlength: '5' },
})
export class IsNumberInputDirective {
  barcodeFormat = /^([0-9]{5})([\.]{1})$/;
  _el: ElementRef;

  constructor(el: ElementRef) {
    this._el = el;
  }
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9.]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('blur', ['$event.target', '$event.target.value'])
  onBlur(el: any, value: string): void {}
}
