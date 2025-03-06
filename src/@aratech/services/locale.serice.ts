import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class AraLocaleService {
  public localeChanged: EventEmitter<any>;

  constructor() {
    this.localeChanged = new EventEmitter();
  }

  setLocale(id) {
    this.localeChanged.emit(id);
  }
}
