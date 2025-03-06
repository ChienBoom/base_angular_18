import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthenticationService } from 'app/core/auth/services/authentication.service';
import { StatehandlerService } from 'app/core/auth/services/statehandler.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'logoutsso',
    standalone: true,
    templateUrl: './logoutsso.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
    providers: [],
})
export class LogoutSSOComponent implements OnInit{
    public user$: Observable<any>;

    constructor(private auth: AuthenticationService) {
        // this.user$ = this.auth.getOIDCUser();
    }

    ngOnInit(): void {}

    triggerSignout(): void {
        this.auth.signout();
    }
}
