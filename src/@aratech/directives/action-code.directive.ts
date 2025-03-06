import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { PermissionService } from '@aratech/services/permission.service';

@Directive({
  selector: '[actionCode]',
})
export class CheckPermissionDirective implements AfterViewInit {
  @Input() actionCode: string;

  constructor(
    public el: ElementRef,
    public permissionService: PermissionService
  ) {}

  ngAfterViewInit(): void {
    // var me = this;
    // me.el.nativeElement.hiden = !me.permissionService.checkUserActionCode(me.actionCode);
    // this.permissionService.getPermissionChangeEvent().subscribe(() => {
    //     me.el.nativeElement.disabled = !me.permissionService.checkUserActionCode(me.actionCode);
    // });
  }
}
