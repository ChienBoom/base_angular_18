import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configs } from '@aratech/utils/configs';
import { UserService } from 'app/core/user/user.service';
import { UserService as AraUserService } from 'app/shared/services/user.service';
import { from, lastValueFrom, mergeMap, Observable, Subject } from 'rxjs';

import { GrantType } from '../models/config.interface';

export interface ICspAuthenService {
  getAuthorization(): string;
}

@Injectable()
export class AuthenticationService implements ICspAuthenService {
  protected _isLoggedIn = false;
  protected key_access_token = 'access_token';
  protected key_refresh_token = 'refresh_token';
  protected key_token_expire_time = 'token_expire_time';
  protected key_current_user = 'usercontext';
  protected key_current_role = 'current_role';
  protected key_customer_id = 'customer_id';
  protected key_user_info = 'user_info';

  protected apiDomain = '';
  protected loginUrl =
    Configs.getConfig('Api_Domain') + Configs.getConfig('LoginUrl');
  public static GetTokenThread: Promise<any>;

  loggedIn: Subject<boolean>;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private araUserService: AraUserService
  ) {
    this.apiDomain = Configs.getConfig('Api_Domain');
    if (this.apiDomain == '' || this.apiDomain == '~/' || this.apiDomain == '/')
      this.apiDomain =
        document.location.protocol + '//' + document.location.host + '/';

    this.loginUrl = this.apiDomain + Configs.getConfig('LoginUrl');

    if (this.loggedIn == null) this.loggedIn = new Subject<boolean>();
    this._isLoggedIn = !!localStorage.getItem(this.key_access_token);
    this.loggedIn.next(this._isLoggedIn);
  }

  getAuthorization(): string {
    return localStorage.getItem(this.key_access_token);
  }

  getAccessToken(): string {
    return localStorage.getItem(this.key_access_token);
  }

  getRefreshToken(): string {
    return localStorage.getItem(this.key_refresh_token);
  }

  logout() {
    this.userService.user = {};
    this._isLoggedIn = false;
    this.loggedIn.next(this._isLoggedIn);
    localStorage.removeItem(this.key_access_token);
    localStorage.removeItem(this.key_token_expire_time);
    localStorage.removeItem(this.key_refresh_token);
    localStorage.removeItem(this.key_current_user);
    localStorage.removeItem(this.key_current_role);
    localStorage.removeItem(this.key_customer_id);
    localStorage.removeItem(this.key_user_info);
  }

  async login(username: string, password: string, loginAccount: boolean) {
    try {
      const nowDate = new Date();
      const grant_type: GrantType = Configs.getConfig('GrantType');
      const grant_type_value = loginAccount
        ? encodeURI(grant_type.DeepCare)
        : encodeURI(grant_type.Password);

      const client_id = encodeURI(Configs.getConfig('ClientId'));
      const client_secret = encodeURI(Configs.getConfig('ClientSecret'));
      const default_role = encodeURI(Configs.getConfig('DefaultRole'));

      const username_encoded = encodeURI(username);
      const password_encoded = encodeURI(password);

      const body: FormData = new FormData();
      body.append('username', username_encoded);
      body.append('password', password_encoded);
      body.append('client_id', client_id);
      body.append('client_secret', client_secret);
      body.append('grant_type', grant_type_value);
      if (loginAccount) body.append('default_role', default_role);
      await lastValueFrom(
        this.http.post(this.loginUrl, body).pipe(
          mergeMap((json: any) => {
            nowDate.setSeconds(nowDate.getSeconds() + json.expires_in - 60);
            localStorage.setItem(this.key_access_token, json.access_token);
            localStorage.setItem(this.key_refresh_token, json.refresh_token);
            localStorage.setItem(
              this.key_token_expire_time,
              nowDate.toISOString()
            );
            localStorage.setItem(this.key_current_user, username);
            console.log('Success Get Access Token');
            return 'OK';
          })
        )
      );
      await this.userService.getUser();

      this._isLoggedIn = true;
      this.loggedIn.next(this._isLoggedIn);
      console.log('Complete Get Access Token');
      return true;
    } catch (e) {
      return false;
    }
  }

  // loginByViettelTicket(ticket: string) {
  //     let headers = new HttpHeaders();
  //     headers.append('Content-Type', 'application/x-www-form-urlencoded');
  //     // let body = `ticket=${ticket}&client_id=${encodeURI(Configs.getConfig('ClientId'))}&client_secret=${encodeURI(Configs.getConfig('ClientSecret'))}&grant_type=viettelsso`;
  //     let body = `service=${encodeURIComponent(Configs.getConfig('ViettelSSOService'))}&ticket=${ticket}&client_id=${encodeURI(Configs.getConfig('ClientId'))}&client_secret=${encodeURI(Configs.getConfig('ClientSecret'))}&grant_type=viettelsso`;
  //     return this.http.post(this.loginUrl, body, { headers: headers })
  //         .toPromise().then(response => {
  //             let json = response.json();
  //             let now = new Date()
  //             now.setSeconds(now.getSeconds() + json.expires_in - 60);
  //             localStorage.setItem(this.key_access_token, json.access_token);
  //             localStorage.setItem(this.key_refresh_token, json.refresh_token);
  //             localStorage.setItem(this.key_token_expire_time, now.toISOString());
  //             localStorage.setItem(this.key_current_user, '');
  //             this._isLoggedIn = true;
  //             this.loggedIn.next(this._isLoggedIn);
  //             return json.access_token;
  //         }, err => {
  //         });
  // }

  async refreshToken(): Promise<string> {
    try {
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const refreshToken = localStorage.getItem(this.key_refresh_token);
      const body = `refresh_token=${encodeURI(
        refreshToken
      )}&client_id=${encodeURI(
        Configs.getConfig('ClientId')
      )}&client_secret=${encodeURI(
        Configs.getConfig('ClientSecret')
      )}&grant_type=${encodeURI('refresh_token')}`;
      const json = await this.http
        .post<any>(this.loginUrl, body, { headers })
        .toPromise();
      const now = new Date();
      now.setSeconds(now.getSeconds() + json.expires_in - 60);
      localStorage.setItem(this.key_access_token, json.access_token);
      localStorage.setItem(this.key_refresh_token, json.refresh_token);
      localStorage.setItem(this.key_token_expire_time, now.toISOString());
      await this.userService.getUser();
      const roles = this.araUserService.getRolesInfo();
      const isAdmin =
        roles.indexOf('Admin') >= 0 || roles.indexOf('RootAdmin') >= 0;
      localStorage.setItem(this.key_current_role, isAdmin ? 'Admin' : '');
      return localStorage.getItem(this.key_access_token);
    } catch {
      return null;
    }
  }

  // async getMyProfile(): Promise<any> {
  //   const headers = {
  //     'Content-Type': 'application/json; charset=utf-8',
  //     'Authorization': `Bearer ${localStorage.getItem(this.key_access_token)}`
  //   }
  //   let url = `${this.apiDomain}${Constants.ApiResources.User.Resource}/${Constants.ApiResources.User.GetMyProfile}`
  //   return this.http.get(url, { headers }).toPromise()
  // }

  async getValidToken(refresh?: boolean): Promise<string> {
    const tokenExpireTime = new Date(
      localStorage.getItem(this.key_token_expire_time)
    );
    const now = new Date();
    let curToken = localStorage.getItem(this.key_access_token);
    if (!curToken) {
      return Promise.resolve(null);
    } else if (tokenExpireTime > now && !refresh) {
      return Promise.resolve(curToken);
    } else {
      if (!AuthenticationService.GetTokenThread) {
        AuthenticationService.GetTokenThread = this.refreshToken();
      }
      curToken = await AuthenticationService.GetTokenThread;
      AuthenticationService.GetTokenThread = undefined;
      return Promise.resolve(curToken);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getValidToken();
    return !(
      token === undefined ||
      token === null ||
      token === '' ||
      token === 'null'
    );
  }

  isLoggedInObs(): Observable<boolean> {
    return from(this.isLoggedIn());
  }

  getCurrentUser(): any {
    const currentUser = localStorage.getItem(this.key_current_user);
    const userContext: any = {};

    if (currentUser && currentUser !== 'undefined')
      userContext.username = currentUser;
    return userContext;
  }

  handleError(error: any) {
    console.error('Có lỗi xảy ra', error);
    if (error.status === 401) {
    }
    return Promise.reject(error);
  }
}
