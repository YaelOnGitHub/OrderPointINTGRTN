import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs'; //Upgraded for RXJS6
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AuthCanActivateGuard implements CanActivate {

  constructor(@Inject(AuthService) protected authService: AuthService<any>, protected router: Router) {}

  /**
   * Checks the auth service to determine if the current user is authenticated.  If the user isn't, redirects to the login page.
   * 
   * @param {ActivatedRouteSnapshot} route 
   * @param {RouterStateSnapshot} state 
   * @returns 
   * @memberof AuthCanActivateGuard
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    //Note: At present IE11 seems to be failing due to CORS (the auth cookie is not being sent by IE to the server)
    return this.authService.getInfo()
      .pipe(
        map(
          data => {
            if (!data) {
              this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
            }
            return (data != null);
          }
        ),
        catchError((err, caught) => { return of(false); }) //Handle errors;
      );
  }
}
