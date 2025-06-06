import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ThemeModule } from '../ytbe/theme/theme.module';
import { AuthModule } from 'src/ytbe/auth/auth.module';
import { TiUser } from 'src/titanium/ti-user.model';
import { TiAuthService } from 'src/titanium/ti-auth.service';
import { environment } from 'src/environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { GlobalApiInterceptor } from './global-api.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { THEME_CONFIG } from '@bcodes/ngx-theme-service';
import { COMMON_CONSTANTS } from './shared/common.constants';
import { CommonSharedModule } from './common/common-shared.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { CoreModule } from 'src/ytbe/core/core.module';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ThemeModule,
    AuthModule.forRoot(TiUser, TiAuthService, {
      base: environment.baseApiEndPoint,
      login: environment.auth.loginEndPoint,
      logout: environment.auth.logoutEndPoint,
      info: environment.auth.getInfoEndPoint
    }),
    NgxPaginationModule,
    NgbModule, ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonSharedModule,
    NgxSpinnerModule,
    AgGridModule.withComponents([])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GlobalApiInterceptor, multi: true },
    {
      provide: THEME_CONFIG,
      useValue: COMMON_CONSTANTS.themeServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}