import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MainService } from '../services/main.service';
import { take, map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
  constructor(
    private router: Router, 
    private mainService:MainService,
    private translate:TranslateService
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {    
    return this.mainService.getCurrentUser().pipe(
      map(currUser => {
        let result:boolean = false;
        if (currUser) {
          // check if route is restricted by role
          if (route.data['roles'] && route.data['roles'].indexOf(currUser.getHomeRole().rank) === -1 && currUser.impersonator === '') {
            // role not authorised so redirect to home page
            this.router.navigate(['/']);
            result = false;
          }
    
          // authorised so return true
          result = true;
        } else {
          result = false;
        }
    
        // not logged in so redirect to login page with the return url
        if (!result){
          this.router.navigate([this.translate.currentLang + '/auth/login'], { queryParams: { returnUrl: state.url } }); 
        }
        
        return result;
      })
    );
  } 
}

