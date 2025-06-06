import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/ytbe/auth/auth.service';
import { AdminService } from '../services/admin.service';
import { MainService } from '../services/main.service';


/**
 * Guard controlling whether or not a user can access the impersonator routes
 */
@Injectable({
  providedIn: 'root'
})
export class ImpersonatingGuard implements CanActivate {
  impUserActive: any;
  constructor(
    private router: Router, 
    private as: AdminService,
    private translate:TranslateService,
    private mainService:MainService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.mainService.getCurrentUser().pipe(
      map(currUser => {
        let result:boolean = false;
        if (currUser?.impersonator !== '') {
          result = true;
        } else {
          result = false;
        }
        if (!result) {          
          this.router.navigate([this.translate.currentLang + '/homeoffice']);
        }
        return result;
      })
    );
  }
}

