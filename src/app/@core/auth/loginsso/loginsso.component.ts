import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, finalize } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';
import { ToasterService } from 'src/app/shared/toaster.service';
import { UserControlService } from 'src/app/users/service/user-control.service';
import { TiAuthService } from 'src/titanium/ti-auth.service';
import { AuthService } from 'src/ytbe/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-sso',
  templateUrl: './loginsso.component.html',
  styleUrls: ['./loginsso.component.scss']
})
export class LoginSSOComponent implements OnInit {
  private _samlToken: string = "";
  private _clientId: string = "";
  private _returnUrl: string = "";  
  private _relayState: string = "";
  isError: boolean = false;

  constructor(
    @Inject(AuthService) private _authService: TiAuthService,
    private _activatedRoute: ActivatedRoute, 
    private _router: Router, 
    private _userControl: UserControlService,
    private _toast: ToasterService,
    private _spinner: NgxSpinnerService,
    private _mainService: MainService,
    public translate: TranslateService, 
    ) { }

  ngOnInit(): void {    
    this._activatedRoute.queryParams.subscribe(params => {
      // following query string paramters will be used for SAML based authentication only
      this._samlToken = params["SAMLResponse"];
      this._clientId = params["clientid"];  
      this._returnUrl = params['returnUrl'];
      this._relayState = params['RelayState'];
    });
    this.ssoRedirect();
  }

  ssoRedirect() {
    // check if its saml based sso 
    if(this._samlToken) {  
        this._mainService.clearSession();
        this._authService.ssoAuth(this._samlToken, this._clientId).pipe(
          finalize(
            () => { 
              const currLang = this.translate.currentLang;
              this._router.navigateByUrl(currLang+'/auth/terms');
            })).subscribe( {
          next: (data) => {
            this._mainService.clientId = new BehaviorSubject('');
            let filter = {
              orderType: '1',
              take: 8, skip: 0, page: 1,
              // repId: null,
              // territoryId: "",
              status: [],
              search: "",
              isNew: false,
              isDownloadable: false,
              itemtype: [],
              repId: '', territoryId: ''
            }
            this._userControl.sidebarFilterControl = new BehaviorSubject(filter);

            this._mainService.clientId.next(data.homeClientId);
            this._mainService.getThemeType.next({
              themeType : data.themeType
            });
            this._toast.showSuccess('Login Successfully', 'Success');
          },
          error: (error) => {
            this._spinner.hide();
            this.isError = true;
          }
        });
      }
    }
}
