import { DefaultUrlSerializer, UrlTree } from '@angular/router';
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    const urls = url.split('?');
    const queryParam = urls.length > 1 ? `?${urls[1]}` : '';
    // return super.parse(url.toLowerCase());
    return super.parse(urls[0].toLowerCase() + queryParam);
  }
}
