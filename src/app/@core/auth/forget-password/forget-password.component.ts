import { ChangeDetectorRef, Component, Inject, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/ytbe/auth/auth.module';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss', './../login/login.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  protected returnUrl: string = '';
  protected action: string = '';
  forgetPasswordForm?: FormGroup;

  constructor(@Inject(AuthService) private authService: AuthService<any>,
    private fb: FormBuilder,
    protected route: ActivatedRoute,
    protected router: Router,
    private spinner: NgxSpinnerService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService,
    private renderer: Renderer2
    ) { }

  /**
   * Whether or not the auth control is currently loading (awaiting a server operation)
   */
  @Input() loading: boolean = false;

  ngOnInit(): void {
    this.initForm();
    this.renderer.removeClass(document.body, 'en-auth-login');

  }

  initForm() {
    this.forgetPasswordForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword', this.translate)
    });
  }

  submitForm() {
    this.spinner.show();

    if (this.forgetPasswordForm?.invalid) {
      return;
    }
    const model: any = this.forgetPasswordForm!.value;

    this.loading = true; //Display loading
    this.changeDetectorRef.detectChanges(); //Force change detection
    this.spinner.hide();


  }

  get f() {
    return this.forgetPasswordForm?.controls;
  }

}


export function ConfirmedValidator(controlName: string, matchingControlName: string, translate: TranslateService) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      //Set Translation
      matchingControl.setErrors({confirmedValidator:'confirmedValidator'})
    } else {
      matchingControl.setErrors(null);
    }
  }
}