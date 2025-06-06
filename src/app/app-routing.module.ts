import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from './shared/gaurd/auth-admin.gaurd';
import { NotAuthGuard } from './shared/gaurd/not-auth.gaurd';
import { TermsAcceptedGuard } from './shared/gaurd/termsaccepted.gaurd';
// import { TermsAcceptedGuard } from './shared/gaurd/termsaccepted.gaurd';
import { Role } from './shared/_models';


const routes: Routes = [
  // English Version
  {
    path: 'en/auth',
    loadChildren: () =>
      import('./@core/auth/auth.module').then((m) => m.AuthModule),
    //canActivate: [NotAuthGuard]
  },
  {
    path: '',
    redirectTo: 'en/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'en',
    redirectTo: 'en/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'en/users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    data: { roles: [Role.SalesRep, Role.DistrictManager, Role.RegionalBusinessDirector] },
    canActivate: [AuthAdminGuard, TermsAcceptedGuard],
  },
  {
    path: 'en/homeoffice',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    data: { roles: [Role.HomeOffice, Role.Admin] },
    canActivate: [AuthAdminGuard, TermsAcceptedGuard] 
  },
  
  {
    path: 'sso-redirect',
    redirectTo: 'en/auth/loginsso',
    pathMatch: 'full',
  },



  // French Version
  {
    path: 'fr/auth',
    loadChildren: () =>
      import('./@core/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NotAuthGuard]
  },
  {
    path: '',
    redirectTo: 'fr/auth/login',
    pathMatch: 'full',
  },
    {
    path: 'fr',
    redirectTo: 'fr/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'fr/users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
      data: { roles: [Role.SalesRep, Role.DistrictManager, Role.RegionalBusinessDirector] },
      canActivate: [AuthAdminGuard, TermsAcceptedGuard],
  },
  {
    path: 'fr/homeoffice',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
      data: { roles: [Role.HomeOffice, Role.Admin] },
      canActivate: [AuthAdminGuard, TermsAcceptedGuard] 
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})], 
  exports: [RouterModule],
})
export class AppRoutingModule { }
