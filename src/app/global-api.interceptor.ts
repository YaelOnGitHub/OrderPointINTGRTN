import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AdminService } from './shared/services/admin.service';
import { MainService } from './shared/services/main.service';


@Injectable()
export class GlobalApiInterceptor implements HttpInterceptor {
  constructor(
    private mainService:MainService,
    private adminService: AdminService
    ) { }
  currentUser: any;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available

    this.adminService.impersonateUserActive.subscribe(res => {
        this.mainService.getCurrentUser().subscribe(u => {          
          this.currentUser = u;
          if (this.currentUser && this.currentUser.xsrfToken) {
            request = request.clone({
              setHeaders: {
                'x-xsrf-token': ` ${this.currentUser.xsrfToken}`,
              },
            });
          }
        });      
    });


    return next.handle(request).pipe(
        catchError((error) => {
          const e = error as HttpErrorResponse;
          if (e) {
            if(e.status === 401) {
              //this.mainService.logOut(); //Log the user out
            }
          }
          return throwError(() => error);  
        })
    )
  }
}
