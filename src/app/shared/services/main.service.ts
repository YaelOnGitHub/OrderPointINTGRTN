import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserControlService } from 'src/app/users/service/user-control.service';
import { BehaviorSubject, catchError, Observable, tap, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TiUser } from 'src/titanium/ti-user.model';
import { TiAuthService } from 'src/titanium/ti-auth.service';
import { AuthService } from 'src/ytbe/auth/auth.service';
import { ExtDataModel } from '../_models/extdatamodel';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  currentUrl: string = '';
  currentLANG = '';
  languageSubject = new BehaviorSubject('en');    //'en' => English    'fr'  => French
  currentTheme = new BehaviorSubject('');
  clientId = new BehaviorSubject('');
  getThemeType = new BehaviorSubject({
    themeType: 0
  });
  languageChange = new BehaviorSubject('');
  logoutChannel;
  cartPageChange = new BehaviorSubject(false);
  triggerRemove = new BehaviorSubject(false);

  /**
   * Holds the current theme value
   */
  currentThemeValue: string ='';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    @Inject(AuthService) private authService: TiAuthService,
    private translate: TranslateService,
    private userControl: UserControlService) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this._updateExtData(); 
      }
      this.currentLANG = this.translate.currentLang;
    });
    try {
    this.logoutChannel = new BroadcastChannel('log-out');
      this.logoutChannel.onmessage = (message) => {
        this._logOutHelper();
      };
    } catch (e) { }

    this.currentTheme.subscribe((curr) => {
      if (curr) this.currentThemeValue = curr;
    });
  }

  /**
   * Obtains the external data for the application (if applicable) from the query string data
   * and stores it in local storage
   * @returns 
   */
  private _updateExtData():void {
        //If one of the known external parameters exists in the query string,
        //then get an external data object and store it in local storage
        this.activatedRoute.queryParams.subscribe(params => {
          let extData:ExtDataModel = ExtDataModel.fromQueryStringParams(params);
          if (
              !extData.fromGskGrc && 
              extData.address1 && 
              extData.firstName && 
              extData.lastName
            ) {
            localStorage.setItem('extData', JSON.stringify(extData));
          } else if (extData.fromGskGrc) {
            localStorage.removeItem('extData');
          }
        });
  }

  /**
   * Sets the translation language for the application
   * @param language Language to use
   */
  setLanguage(language: string) {
    this.languageSubject.next(language);
    this.translate.use(language);
    this.router.navigateByUrl('/' + language + '/' + this.currentUrl.slice(4, this.currentUrl.length));
  }

  /**
   * Obtain settings for the specified client ID
   * @param clientId Client ID for which to obtain settings
   * @returns 
   */
  getSettings(clientId: any) {
    const apiUrl = environment.baseApiEndPoint + 'clients/' + clientId + '/ui-settings';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  /**
   * Obtain extra info for the specified client ID
   * @param clientId Client ID for which to obtain settings
   * @returns 
   */
  getAdditionalnformation(clientId: any) {
    const apiUrl = environment.baseApiEndPoint + clientId + '/users/get-additional-information';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  /**
   * Obtains the external data for the application (if applicable)
   * @returns 
   */
  getExternalData():Observable<ExtDataModel|undefined> {    
    const extData = JSON.parse(localStorage.getItem('extData') as any);    
    return extData ? of(new ExtDataModel(extData)) : of(undefined);
  }

  /**
   * Retrieves the current user object from local storage
   * @returns 
   */
  getCurrentUser():Observable<TiUser>{ 
    return this.authService.getCurrentUser();
  }

  /**
   * Clears session state
   */
  clearSession(clearAll:boolean = false) {    
    let filterSelection = {
      orderType: '',
      take: 8, skip: 0, page: 1,
      // repId: null,
      // territoryId: "",
      // status: '',
      status: [],
      search: "",
      isNew: false,
      isDownloadable: false,

      itemtype: [],

      repId: '', territoryId: ''
    }
    this.userControl.sidebarFilterControl.next(filterSelection);
    sessionStorage.clear();

    if (clearAll){
      localStorage.clear();
    } else {
      for(let i:number = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        switch(key) {
          case 'extData':
            //Do nothing - leave external data in local storage
            break;
          default:
            localStorage.removeItem(key as string);
            break;
        }
      }
    }
  }
  logOut(){
    try {
      if (this.logoutChannel) this.logoutChannel.postMessage('log-out');
    } catch (e) {}

    this._logOutHelper();
    this.authService.logout().subscribe(() => {});
  }

  private _logOutHelper(){      
    this.getCurrentUser().subscribe(currUser => {  
        this.clearSession(true);
        
        const currentLang = this.translate.currentLang;
        if (!currUser.impersonator){
          this.router.navigate([currentLang+'/auth/logout']); 
        } else {
          this.router.navigate([currentLang]); 
        }
    });
  }

  // getTheme() {
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/users/theme';
  //   return this.http.get<any>(apiUrl).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

  // setTheme(themeID: number) {
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/users/theme/' + themeID;
  //   return this.http.post<any>(apiUrl, {}).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

  handleError(error: any): any {
    return throwError(error);
  }

}
