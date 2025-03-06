import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Guid } from '@aratech/utils/guid';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';

@Injectable({
  providedIn: 'root',
})
export class WaitingService {
  injector: Injector;
  splashService: FuseSplashScreenService;
  onWaitingChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  static queueWaiting: string[] = [];
  static queueWaitingBar: string[] = [];

  constructor(_injector: Injector, _splashService: FuseSplashScreenService) {
    this.injector = _injector;
    this.splashService = _splashService;
  }

  startWaiting(): string {
    const id = Guid.newGuid();
    this.splashService.show(true);
    WaitingService.queueWaiting.push(id);
    return id;
  }

  stopWaiting(id: string) {
    if (!id) {
      WaitingService.queueWaiting = [];
    } else {
      const index = WaitingService.queueWaiting.indexOf(id, 0);
      if (index > -1) WaitingService.queueWaiting.splice(index, 1);
    }

    if (WaitingService.queueWaiting.length == 0) this.splashService.hide();
  }

  startWaitingBar() {
    const id = Guid.newGuid();
    this.onWaitingChange.emit(true);
    WaitingService.queueWaitingBar.push(id);
    return id;
  }

  stopWaitingBar(id: string) {
    if (!id) {
      WaitingService.queueWaitingBar = [];
    } else {
      const index = WaitingService.queueWaitingBar.indexOf(id, 0);
      if (index > -1) WaitingService.queueWaitingBar.splice(index, 1);
    }

    if (WaitingService.queueWaitingBar.length == 0)
      this.onWaitingChange.emit(false);
  }
}
