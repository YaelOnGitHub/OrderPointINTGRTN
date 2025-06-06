import { throwError as observableThrowError, ReplaySubject, Observable, Subject, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formUrlEncoded } from '../../ytbe/http/form-urlencoded';
import { BaseClass } from '../models/base-class.model';
import { AuthUser } from './auth-user.model';
import { AuthService } from './auth.module';

export class AuthAccountApiEndpoints extends BaseClass {
  base: string = 'api/account/';
  changePassword: string = 'changePassword';

  constructor(init?: Partial<AuthAccountApiEndpoints>) {
    super();
    this.init(init);
  }
}

/**
 * List of endpoints used by Auth Serice
 * */
export enum AuthAccountApiEndpointsTypes {
  changePassword = "changePassword"
};

/**
 * AuthAccount service.
 */
@Injectable()
export class AuthAccountService<TUserProfile extends BaseClass = AuthUser> {

  /** Provider name for Api Endpoints */
  static PROVIDER_ENDPOINTS: string = "AuthAccountApiEndpoints";

  /**
   * Gets the API path for the specified endpoint
   * @param endpoint Endpoint path to return
   */
  protected getAPIPath(endpoint: AuthAccountApiEndpointsTypes) {
    return this.endpoints.base + this.endpoints[endpoint];
  }
    
  constructor(
    protected http: HttpClient,
    @Inject(AuthService) protected authService: AuthService<any>,
    @Inject(AuthAccountService.PROVIDER_ENDPOINTS) protected endpoints: AuthAccountApiEndpoints
  ) {
    this.endpoints = new AuthAccountApiEndpoints(this.endpoints);    
  }
  
  /**
   * Changes the user's password
   * @param oldPassword User's existing password
   * @param newPassword New password (confirm password should be implemented with validation prior to calling function)
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const path = this.getAPIPath(AuthAccountApiEndpointsTypes.changePassword);
    const body:string = formUrlEncoded({oldPassword:oldPassword, newPassword:newPassword}); //Call utility function to form-encode request

    const req: Observable<any> = this.http.post<any>(path, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      });
    
    return req;
  }
}
