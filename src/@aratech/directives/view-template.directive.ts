import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[view-template]',
})
export class ViewTemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
