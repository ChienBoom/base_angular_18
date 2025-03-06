import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { StatehandlerService, StatehandlerServiceImpl } from './statehandler.service';
import { authSSOConfig } from '../authsso/authsso.config,';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _authenticated: boolean = false;
    private readonly _authenticationChanged: BehaviorSubject<boolean> =
        new BehaviorSubject(this.authenticated);

    constructor(
        private oauthService: OAuthService,
        // private statehandler: StatehandlerService,
        private statehandler: StatehandlerServiceImpl
    ) {}

    public get authenticated(): boolean {
        return this._authenticated;
    }

    public get authenticationChanged(): Observable<boolean> {
        return this._authenticationChanged;
    }

    public getOIDCUser(): Observable<any> {
        return from(this.oauthService.loadUserProfile());
    }

    public async authenticate(setState: boolean = true): Promise<boolean> {
        this.oauthService.configure(authSSOConfig);
        this.oauthService.setupAutomaticSilentRefresh(); //ham tu dong lay token khi het han

        this.oauthService.strictDiscoveryDocumentValidation = false;
        await this.oauthService.loadDiscoveryDocumentAndTryLogin();

        this._authenticated = this.oauthService.hasValidAccessToken();

        if (!this.oauthService.hasValidIdToken() || !this.authenticated) {
            const newState = setState
                ? await this.statehandler.createState().toPromise()
                : undefined;
            this.oauthService.initCodeFlow(newState);
        }
        this._authenticationChanged.next(this.authenticated);
        return this.authenticated;
    }

    public signout(): void {
        this.oauthService.logOut();
        this._authenticated = false;
        this._authenticationChanged.next(false);
    }
}
