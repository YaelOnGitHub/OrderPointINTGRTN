import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsCommonModule } from 'src/ytbe/forms/forms-common.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TermsComponent } from './terms/terms.component';
import { LogOutComponent } from './logout/logout.component';
import { LoginSSOComponent } from './loginsso/loginsso.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgetPasswordComponent,
    TermsComponent,
    LogOutComponent,
    LoginSSOComponent,
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FormsCommonModule,
    ToastrModule.forRoot(),
    TranslateModule,
    SharedModule
  ]
})
export class AuthModule { }
