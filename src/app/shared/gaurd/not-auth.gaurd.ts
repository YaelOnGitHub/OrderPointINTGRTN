import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainService } from '../services/main.service';
import { Role } from '../_models';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private mainService: MainService) { }

  protected returnUsersUrl: string = 'en/users';
  protected returnHomeOfficeUrl: string = 'en/homeoffice';

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.mainService.getCurrentUser().pipe(
      map(currUser => {
        if (!currUser) {
          return true;
        } else {
          const role = currUser.getHomeRole();

          if (currUser.impersonator !== '' && Role.Admin === role.rank) {
            this.router.navigateByUrl(this.returnHomeOfficeUrl);
          } else {

            switch (role.rank) {
              case Role.Admin:
              case Role.HomeOffice:
              case Role.ITAdmin:
                this.router.navigateByUrl(this.returnHomeOfficeUrl);
                break;
              default:
                this.router.navigateByUrl(this.returnUsersUrl);
                break;
            }
          }
          return false;
        }
      })
    );
  }
}
