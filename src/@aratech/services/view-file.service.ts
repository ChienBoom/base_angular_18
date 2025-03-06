import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AraViewExcelComponent } from '@aratech/components/ara-view-excel/ara-view-excel.component';
import { AraViewPdfComponent } from '@aratech/components/ara-view-pdf/ara-view-pdf.component';
import { BaseService } from '@aratech/services/base.service';
import { DownloadFileUtils } from '@aratech/utils/downloadFileUtils';
import { Constants } from 'app/shared/constants';

@Injectable({
  providedIn: 'root',
})
export class ViewFileService extends BaseService<any> {
  static allActions: any[];
  constructor(http: HttpClient, injector: Injector) {
    super(http, Constants.ApiResources.ViewFiles.Resource, injector);
  }

  async getFileStreamById(fileId: string, dialog: MatDialog) {
    const headers = new HttpHeaders();
    const url = `${this.svUrl}/GetById/${fileId}`;

    try {
      const response = await this.httpGet(url, {
        responseType: 'blob',
        observe: 'response',
        headers: headers,
      });
      const filename = DownloadFileUtils.getFilenameFromHeader(response);
      const arrName = filename.split('.');
      const ext = arrName[arrName.length - 1].toLowerCase();

      if (dialog && ext === 'pdf') {
        const dialogRef = dialog.open(AraViewPdfComponent, {
          panelClass: 'dialog-fullscreen',
          data: {
            streamData: response,
            filename: filename,
            extension: ext,
            fileId: fileId,
          },
        });

        dialogRef.componentInstance.downloadClick.subscribe(() => {
          this.downloadFile(fileId);
        });
      }
      // else if (dialog && (ext === 'xlsx' || ext === 'xls')) {
      //     dialog.open(AraViewExcelComponent, {
      //         panelClass: 'dialog-fullscreen',
      //         data: {
      //             streamData: response,
      //             filename: filename
      //         }
      //     });
      // }
      else {
        DownloadFileUtils.viewOrDownloadFile(response, true);
      }
    } catch (err) {
      throw err;
    }
  }

  async downloadFile(fileId: string) {
    const headers = new HttpHeaders();
    const url = `${this.svUrl}/getById/${fileId}`;

    try {
      const response = await this.httpGet(url, {
        responseType: 'blob',
        observe: 'response',
        headers: headers,
      });
      DownloadFileUtils.viewOrDownloadFile(response, true);
    } catch (err) {
      throw err;
    }
  }

  async getViewImgById(fileId: string) {
    const headers = new Headers();
    const url =
      this.svUrl.replace(
        Constants.ApiResources.ViewFiles.Resource,
        Constants.ApiResources.ViewFiles.ResourceImage
      ) + fileId;

    try {
      const stream = await this.httpGet(url, { headers: headers });
      if (stream) return stream.url;
    } catch (err) {
      throw err;
    }
  }
  getUrlImageById(fileId: string) {
    return (
      this.svUrl.replace(
        Constants.ApiResources.ViewFiles.Resource,
        Constants.ApiResources.ViewFiles.ResourceImage
      ) + fileId
    );
  }
}
