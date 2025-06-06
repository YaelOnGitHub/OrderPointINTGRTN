import { NgModule, ModuleWithProviders } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService, AuthApiEndpoints } from './auth.service';
import { AuthCanActivateGuard } from './auth-canactivate.guard';
import { AuthInterceptor } from './auth.interceptor';
import { ThemeService } from '../theme/theme.service';
import { BaseClass } from '../models/base-class.model';
import { AuthUser } from './auth-user.model';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthCanActivateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ]
})
export class AuthModule {
  constructor() { }
  static forRoot(
    userType: any = AuthUser,
    useAuthService: any = AuthService,
    authEndpoints?: Partial<AuthApiEndpoints>
    ): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: AuthService,
          useClass: useAuthService, //Use custom implementation of service or default (if not specified)
          deps: [HttpClient, ThemeService, Router, AuthService.PROVIDER_ENDPOINTS, AuthService.PROVIDER_USERFACTORY],
          multi: false
        },
        { provide: AuthService.PROVIDER_ENDPOINTS, useValue: authEndpoints },
        //Create provider that can be used to create user objects by getting constructor for userType
        { provide: AuthService.PROVIDER_USERFACTORY, useValue: BaseClass.getFactory(userType) }
      ]
    };
  }
}
export * from './auth.service';
export * from './auth.interceptor';
export * from './auth-canactivate.guard';
