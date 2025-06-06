import { ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, finalize } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from 'src/app/shared/toaster.service';
import { UserControlService } from 'src/app/users/service/user-control.service';
import { TiAuthService } from 'src/titanium/ti-auth.service';
import { AuthService } from 'src/ytbe/auth/auth.service';
import { setRemoteFeedback } from 'src/ytbe/forms/form-feedback/set-remote-feedback';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  protected returnUsersUrl: string = 'en/users';
  protected returnManagerUrl: string = 'en/manager';
  protected returnAdminUrl: string = 'en/homeoffice';

  protected action: string = '';
  loginForm?: FormGroup;
  currentLANG = '';
  constructor(
    @Inject(AuthService) private authService: TiAuthService,
    private fb: FormBuilder,
    private _mainService: MainService,
    private userControl: UserControlService,
    protected route: ActivatedRoute,
    protected router: Router, 
    private _toast: ToasterService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public langChange: MainService,
    private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'en-auth-login');
  }

  /**
   * Whether or not the auth control is currently loading (awaiting a server operation)
   */
  @Input() loading: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.getInfo();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  getInfo(){
    this.authService.getInfo().subscribe((res) => {
      if (res){
        const currentLang = this.translate.currentLang; //Get current language and use in URL
        this.router.navigateByUrl(currentLang+'/auth/terms');
      }
    });
  }

  login() {
    this.spinner.show();
    const model: any = this.loginForm!.value;
    this.loading = true; //Display loading
    this.changeDetectorRef.detectChanges(); //Force change detection
    this._mainService.clearSession();
    this.authService.login(model.email, model.password).pipe(
      finalize(
        () => { 
          this.loading = false;           
          const currentLang = this.translate.currentLang; //Get current language and use in URL
          this.router.navigateByUrl(currentLang+'/auth/terms');
        })).
        subscribe(
        {
          next: (data) => {
            // this.spinner.hide();
            // console.log(data); //Result of login is here
            this._mainService.clientId = new BehaviorSubject('');
            let filter = {
              orderType: '',
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
            this.userControl.sidebarFilterControl = new BehaviorSubject(filter);

            this._mainService.clientId.next(data.homeClientId);
            this._mainService.getThemeType.next({
              themeType : data.themeType
            });
            this.translate.get('signInPage.messages.success').subscribe(msg => {
              this._toast.showSuccess(msg.message, msg.type);
            });
          },
          error: (error) => {
            this.spinner.hide();
            setRemoteFeedback(this.loginForm!, error);
            this.translate.get('signInPage.messages.invalidLogin').subscribe(msg => {
              this._toast.showError(msg.message, msg.type);
            });
          }
        }
      );
  }

  get f() {
    return this.loginForm?.controls;
  }


}
