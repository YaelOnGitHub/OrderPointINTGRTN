import { environment } from '../environments/environment';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthApiEndpoints, AuthService } from '../ytbe/auth/auth.service';
import { TiUser, TiClient, TiRole } from './ti-user.model';
import { TiTheme } from './ti-theme.model';
import { Observable, ReplaySubject, map, pipe, tap, of, catchError } from 'rxjs';
import { ThemeService } from '../ytbe/theme/theme.service';

/**
 * Authentication service
 */
@Injectable()
export class TiAuthService extends AuthService<TiUser> {
  /**
   * Current client
   */
  client: ReplaySubject<TiClient| undefined> = new ReplaySubject<TiClient| undefined>(1);
  role: ReplaySubject<TiRole | undefined> = new ReplaySubject<TiRole | undefined>(1);
  logo: ReplaySubject<string | undefined> = new ReplaySubject<string| undefined>(1);

  private _clientId:string =""; //Holds ID of current client
  private _logoutUrl:string =""; //Holds current logout Url

  private subscribeMembers():void {
      //Capture current user's logoutUrl
      this.user.subscribe(user => {
        this._logoutUrl = user ? user.logoutUrl ?? '' : '';
      });

      //Capture current client ID
      this.client.subscribe(client => {
        this._clientId = client ? client.id : '';
      });
  }

  constructor(
    protected override http: HttpClient, protected override themeService: ThemeService, protected override router: Router,
    @Inject(AuthService.PROVIDER_ENDPOINTS) protected override endpoints: Partial<AuthApiEndpoints>,
    @Inject(AuthService.PROVIDER_USERFACTORY) protected override userFactory: { new(...args: any): any; }
  ) {
      super(http, themeService, router, endpoints, userFactory);
      this.subscribeMembers();
  }
  
  /**
   * Logs the user in
   * @param username Username
   * @param password Password
   */
   override login(username: string, password: string): Observable<TiUser>{
    const resp = super.login(username, password).pipe(
      tap(
        (result: any) => {
          localStorage.removeItem('identity'); 
          localStorage.setItem('identity', JSON.stringify(result));
          this.user.next(new this.userFactory(result));
        }
      ) //Notify replyable subject;
    );

    this.subscribeMembers();
    return resp;
  }

  /**
   * Places a SAML token authentication request to the server
   * @param samlToken SAML token
   * @param clientId Client ID
   * @returns 
   */
  public ssoAuth(samlToken: string, clientId: string): Observable<TiUser> {    
    const req: Observable<TiUser> = this.http.post<any>(`${environment.baseApiEndPoint}auth/loginsso`, {
      clientId: clientId,
      SAMLResponse: samlToken
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(
        (result: any) => {
          localStorage.removeItem('identity');
          localStorage.setItem('identity', JSON.stringify(result));
          result.ssoUser = true;
          this.user.next(new this.userFactory(result));
        }
      ) //Notify replyable subject;
    );
    return req;
  }

  /**
   * Retrieves the current user object from local storage
   * @returns 
   */
  getCurrentUser():Observable<TiUser>{ 
    const userData = JSON.parse(localStorage.getItem('identity') as any);    
    return userData ? of(new this.userFactory(userData)) : of(undefined);
  }

  /**
   * Gets the login URL
   */
  getLoginUrl():Observable<any>{
    let path: string = environment.baseApiEndPoint;
    path = path + "auth/login-url";
    return this.http.get(path, {responseType:'text'}).pipe(catchError(() => {
      return of(undefined);
    }));
  }
  /**
   * Gets information about the user from the server
   */
  override getInfo(): Observable<TiUser>{    
    return super.getInfo().pipe(tap((result:any) => {
      localStorage.removeItem('identity');
      localStorage.setItem('identity', JSON.stringify(result));

      if (environment.auth.loginRedirect && !this.isAuthenticated){
        window.location.replace(environment.auth.loginRedirect);//Redirect to Titanium on LogOut
      }
    }));
  }
  /**
   * Logs the user out
   */
  override logout():Observable<any>{
    var logoutUrl:string = this._logoutUrl;
    return super.logout().pipe(tap(() => {
      localStorage.removeItem('identity');
    
      // Reload the entire application
      window.location.reload();
      if (environment.auth.logoutRedirect){
        window.location.replace(environment.auth.logoutRedirect);//Redirect to Titanium on LogOut
      } else if (logoutUrl){
        window.location.replace(logoutUrl); //Redirect to logout URL specified in user's profile
      }
    }));
  }
}
