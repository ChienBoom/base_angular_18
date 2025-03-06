import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  isAdmin = false;

  constructor() {}

  setAdmin(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }

  getAdmin() {
    return this.isAdmin;
  }
}
