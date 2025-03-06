import { Directive, HostListener } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';

@Directive({
  selector: 'input[trim], textarea[trim]',
})
export class InputTrimDirective extends DefaultValueAccessor {
  private dispatchEvent(el, eventType) {
    const event = document.createEvent('Event');
    event.initEvent(eventType, false, false);
    el.dispatchEvent(event);
  }

  @HostListener('blur', ['$event.target', '$event.target.value'])
  onBlur(el: any, value: string): void {
    if ('function' === typeof value.trim && value.trim() !== value) {
      el.value = value.trim();

      this.dispatchEvent(el, 'input');
      this.dispatchEvent(el, 'blur'); // in case updateOn is set to blur
    }
  }

  @HostListener('keypress', ['$event', '$event.target', '$event.target.value'])
  onkeypress(e: any, el: any, value: string): void {
    if (
      e.keyCode == 13 &&
      'function' === typeof value.trim &&
      value.trim() !== value
    ) {
      el.value = value.trim();

      this.dispatchEvent(el, 'input');
      this.dispatchEvent(el, 'keypress');
    }
  }
}
