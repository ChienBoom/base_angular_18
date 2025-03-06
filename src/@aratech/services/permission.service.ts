import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  userActionCodes: string[] = [];
  roles: string[] = [];
  notCheckPermission = false;
  onPermissionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  setPermission(roles: string[], userActionCodes: string[]) {
    this.roles = roles;
    this.userActionCodes = userActionCodes;
    this.notCheckPermission = false;
    this.onPermissionChange.emit();
  }

  getPermissionChangeEvent() {
    return this.onPermissionChange;
  }

  public checkUserActionCode(actionCode: string): boolean {
    if (!actionCode || this.notCheckPermission) return true;
    if (
      this.roles.indexOf('Admin') >= 0 ||
      this.roles.indexOf('RootAdmin') >= 0
    )
      return true;
    return this.userActionCodes.indexOf(actionCode.toLowerCase()) >= 0;
  }
}
