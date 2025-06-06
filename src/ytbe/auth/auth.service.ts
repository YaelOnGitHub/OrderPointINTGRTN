import { throwError as observableThrowError, ReplaySubject, Observable, Subject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThemeService } from '../theme/theme.service';
import { formUrlEncoded } from '../http/form-urlencoded';
import { AuthUser } from './auth-user.model';
import { BaseClass } from '../models/base-class.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

export class AuthApiEndpoints extends BaseClass {
  base: string = 'api/auth/';
  login: string = 'login';
  logout: string = 'logout';
  confirmEmail: string = 'confirmEmail';
  signup: string = 'signup';
  info: string = 'info';
  heartbeat: string = 'heartbeat';

  constructor(init?: Partial<AuthApiEndpoints>) {
    super();
    this.init(init);
  }
}

/**
 * List of endpoints used by Auth Serice
 * */
export enum AuthApiEndpointTypes {
  login = "login",
  logout = "logout",
  confirmEmail = "confirmEmail",
  signup = "signup",
  info = "info",
  heartbeat = "heartbeat"
};

/**
 * Authentication service.  Defaults to using AuthUser model.
 */
@Injectable()
export class AuthService<
  TUser extends BaseClass = AuthUser> {

  /** Provider name for Api Endpoints */
  static PROVIDER_ENDPOINTS: string = "authApiEndpoints";
  static PROVIDER_USERFACTORY: string = "authUserFactory";

  /**
   * Gets the API path for the specified endpoint
   * @param endpoint Endpoint path to return
   */
  protected getAPIPath(endpoint: AuthApiEndpointTypes) {
    return this.endpoints ? this.endpoints.base + this.endpoints[endpoint]! : '';
  }

  /**
   * Expiration of the user's session
   */
  expires: Subject<number> = new Subject();

  /**
   * Replay subject automatically gives subscribers the most recent object immediately upon subscription and updates them when a new update takes place.
   * The replay subject allows us to link the GetInfo and Login method reponses so we can listen for a user on either one.
   */
  user: ReplaySubject<TUser | undefined> = new ReplaySubject<TUser | undefined>(1);
  isAuthenticated: boolean = false;

  constructor(
    protected http: HttpClient, protected themeService: ThemeService, protected router: Router,
    @Inject(AuthService.PROVIDER_ENDPOINTS) protected endpoints: Partial<AuthApiEndpoints>,
    @Inject(AuthService.PROVIDER_USERFACTORY) protected userFactory: { new(...args: any): any; }
  ) {
    this.endpoints = new AuthApiEndpoints(this.endpoints);

    //Default factory
    if (!userFactory) {
      userFactory = BaseClass.getFactory(AuthUser);
    }

    this.user.subscribe(u => { this.isAuthenticated = (u != null); });
  }

  /**
   * Retrieves cached user object if available or asynchronously retrieves user information from authentication cookie (if available).
   */
  getInfo(force: boolean = false): Observable<TUser | any> {
    const path = this.getAPIPath(AuthApiEndpointTypes.info);

    if (this.isAuthenticated && !force) {
      return this.user;
    } else {
      //Set respone type to "text" to allow for nullable response and then manually parse JSON
      //See: https://github.com/angular/angular/issues/18680
      return this.http.get(path).pipe(
        tap(
          u => {
            this.user.next(new this.userFactory(u));
          }
        ),
        catchError(
          (err, caught) => {
            this.user.next(undefined);
            return of(null);
          }
        )
      );
    }
  }

  /**
   * Registers a heartbeat for the user with the server (Extends the user's session where applicable)
   */
  heartbeat(): Observable<any> {
    const path = this.getAPIPath(AuthApiEndpointTypes.heartbeat);
    return this.http.post(path, "");
  }

  /**
   * Attempts to login with the specified username and password.
   * @param username Username
   * @param password Password
   */
  login(username: string, password: string): Observable<TUser> {
    const path = this.getAPIPath(AuthApiEndpointTypes.login);
    const body: string = formUrlEncoded({
      username: username, password: password
    }); //Call utility function to form-encode request

    const req: Observable<TUser> = this.http.post<any>(path, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });

    return req;
  }

  /**
   * Confirm changes to the user's email address
   * @param user Username
   * @param token Confirmation token
   */
  confirmEmail(username: string, token: string, email: string = ''): Observable<any> {
    const path = this.getAPIPath(AuthApiEndpointTypes.confirmEmail);
    const body: string = formUrlEncoded({ username: username, token: token, email: email }); //Call utility function to form-encode request

    const req: Observable<any> = this.http.post<any>(path, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });

    return req;
  }

  /**
   * Signs the user out
   */
  logout(): Observable<any> {
    const path = this.getAPIPath(AuthApiEndpointTypes.logout);
    const req = this.http.post(path, "").pipe(catchError((error: any, caught: Observable<any>) => {   
      try {
        this.user.next(undefined); //Clear the user
      } catch (e){}
      // console.log("Error calling logout");
      return throwError(() => error);
    }), tap(
      () => {         
        try {
          this.user.next(undefined);
          //this.router.navigate(['login']);
        } catch (e){}
      }
    )); //Clear the user

    return req;
  }
}
