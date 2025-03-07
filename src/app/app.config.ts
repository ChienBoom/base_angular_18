import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    APP_INITIALIZER,
    ApplicationConfig,
    inject,
    isDevMode,
    provideAppInitializer,
} from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ConfigService } from '@aratech/services/config.service';
import { provideFuse } from '@fuse';
import { TranslocoService, provideTransloco } from '@jsverse/transloco';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { appRoutes } from 'app/app.routes';
import { provideAuth } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { MockApiService } from 'app/mock-api';
import { firstValueFrom } from 'rxjs';
import { StatehandlerServiceImpl } from './core/auth/services/statehandler.service';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';

const stateHandlerFn = (stateHandler: StatehandlerServiceImpl) => {
    return () => {
        return stateHandler.initStateHandler();
    };
};
export function initializeApp(configService: ConfigService) {
    // return () =>
    //     configService
    //         .loadConfig()
    //         .toPromise()
    //         .then((config) => {
    //             configService.setConfig(config);
    //         });
    return () =>
        firstValueFrom(configService.loadConfig()).then((config) =>
            configService.setConfig(config)
        );
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        provideRouter(
            appRoutes,
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        ),

        // Material Date Adapter
        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'D',
                },
                display: {
                    dateInput: 'DDD',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        // Transloco Config
        provideTransloco({
            config: {
                availableLangs: [
                    {
                        id: 'en',
                        label: 'English',
                    },
                    {
                        id: 'tr',
                        label: 'Turkish',
                    },
                    {
                        id: 'vi',
                        label: 'Việt Nam',
                    },
                ],
                defaultLang: 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader,
        }),
        provideAppInitializer(() => {
            const translocoService = inject(TranslocoService);
            const defaultLang = translocoService.getDefaultLang();
            translocoService.setActiveLang(defaultLang);
            return firstValueFrom(translocoService.load(defaultLang));
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigService],
            multi: true,
        },

        // Fuse
        provideAuth(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay: 0,
                service: MockApiService,
            },
            fuse: {
                layout: 'classy',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-default',
                themes: [
                    {
                        id: 'theme-default',
                        name: 'Default',
                    },
                    {
                        id: 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id: 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id: 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id: 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id: 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),

        provideOAuthClient(),
        {
            provide: APP_INITIALIZER,
            useFactory: stateHandlerFn,
            multi: true,
            deps: [StatehandlerServiceImpl],
        },
        provideHttpClient(withInterceptorsFromDi()),
    ],
};
