import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { TermsComponent } from './terms/terms.component';
import { LoginSSOComponent } from './loginsso/loginsso.component';
import { LogOutComponent } from './logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'loginsso',
        component: LoginSSOComponent,
      },
      {
        path: 'logout',
        component: LogOutComponent,
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
      },
      {
        path: 'terms',
        component: TermsComponent,
      },
      {
        path: 'logout',
        component: LogOutComponent,
      },
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
