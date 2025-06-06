import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { AuthAccountService, AuthAccountApiEndpoints } from './auth-account.service';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class AuthAccountModule {
  constructor() { }
  static forRoot(
    authAccountEndpoints: Partial<AuthAccountApiEndpoints> = null,
    useAuthAccountService: any = AuthAccountService
    ): ModuleWithProviders {
    return {
      ngModule: AuthAccountModule,
      providers: [
        {
          provide: AuthAccountService,
          useClass: useAuthAccountService, //Use custom implementation of service or default (if not specified)
          deps: [HttpClient, AuthService, AuthAccountService.PROVIDER_ENDPOINTS],
          multi: false
        },
        { provide: AuthAccountService.PROVIDER_ENDPOINTS, useValue: authAccountEndpoints }
      ]
    };
  }
}
export * from './auth-account.service';
