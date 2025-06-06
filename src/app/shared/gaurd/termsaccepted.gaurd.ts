import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class TermsAcceptedGuard implements CanActivate {
  constructor(private router: Router,
    private translate: TranslateService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (sessionStorage.getItem('termsAccepted') != null) {
      return true;
    } else {
      const currLang = this.translate.currentLang;
      console.log('here');
      this.router.navigate([currLang + '/auth/terms']);
      return false;
    }
  }
}

