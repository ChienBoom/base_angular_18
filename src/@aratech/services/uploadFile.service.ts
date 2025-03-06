import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Constants } from 'app/shared/constants';

import { BaseService } from './base.service';

@Injectable()
export class UploadFileService extends BaseService<any> {
  static allActions: any[];
  constructor(http: HttpClient, injector: Injector) {
    super(http, Constants.ApiResources.File.Resource, injector);
  }

  uploadFiles(formData: FormData): Promise<any> {
    const headers = new HttpHeaders();
    //headers.append('Content-Type', 'multipart/form-data');
    return this.httpPost(
      this.svUrl,
      formData,
      { headers: headers },
      true,
      false
    ).then(
      response => {
        return response;
      },
      err => {
        throw err;
      }
    );
  }
}
