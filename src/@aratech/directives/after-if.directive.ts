import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';

@Directive({ selector: '[after-if]' })
export class AfterIfDirective implements AfterContentInit {
  @Output('after-if')
  after: EventEmitter<ElementRef> = new EventEmitter();
  element: ElementRef;

  constructor(el: ElementRef) {
    this.element = el;
  }

  public ngAfterContentInit(): void {
    setTimeout(() => {
      this.after.next(this.element);
    });
  }
}
