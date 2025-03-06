import { Injectable } from '@angular/core';

@Injectable()
export class LoadResourceService {
  loadScript(url: string, name: string): Promise<void> {
    if (document.getElementById(name)) return Promise.resolve();

    return new Promise(resolve => {
      const scriptElement = document.createElement('script');
      scriptElement.src = url;
      scriptElement.id = name;
      scriptElement.type = 'text/javascript';
      scriptElement.onload = () => {
        resolve();
      };
      document.body.appendChild(scriptElement);
    });
  }

  loadStyle(url: string, name: string): Promise<void> {
    if (document.getElementById(name)) return Promise.resolve();

    return new Promise(resolve => {
      const styleElement = document.createElement('link');
      styleElement.href = url;
      styleElement.rel = 'stylesheet';
      styleElement.id = name;
      styleElement.onload = () => {
        resolve();
      };
      document.head.appendChild(styleElement);
    });
  }
}
