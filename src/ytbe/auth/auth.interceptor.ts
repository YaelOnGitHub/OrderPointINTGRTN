import { environment } from '../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Listen for session expiration header
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  xsrfToken: string = '';
  expires: number = -1;
  private _interval? : any;

  constructor(private _injector: Injector){
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Cache-busting header
    //req = req.clone({headers: req.headers.set('Cache-Control', 'no-cache').set('Pragma', 'no-cache').set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')});
    let authReq = req;
    if (this.xsrfToken){ //Add the XSRF token
      authReq = req.clone({headers: req.headers.set('X-XSRF-Token', this.xsrfToken)});
    }
    if (!environment.production) {
      authReq = authReq.clone({withCredentials: true});
    }
    const authService:AuthService<any> = this._injector.get(AuthService);
    const router:Router = this._injector.get(Router);
    const url:string = router.routerState.snapshot.url;

    return next.handle(authReq).pipe(tap( (event:HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const expires:number = Math.ceil(parseFloat(event.headers.get('X-Session-Expires')!));
          if (expires){
            this.expires = expires;
            if (this._interval) { 
              clearInterval(this._interval);
            }
            let self = this;
            this._interval = setInterval(function(){
              self.expires--;
              authService.expires.next(self.expires); //Update listeners

              if (self.expires <= 0){ //Force user sign out
                clearInterval(self._interval);

                setTimeout(function(){ 
                  //Redirect to login
                  router.navigate(['login'], { queryParams: { returnUrl: url, action: "logout" }});
                 }, 1000); //Force user sign-out
              }
            }, 1000);
          }

          let xsrf = event.headers.get('X-XSRF-Token');
          if (xsrf) {
            this.xsrfToken = xsrf;
          }
        }
      })
      );
  }
}
