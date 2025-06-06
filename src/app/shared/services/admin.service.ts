import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AdminService {
  userNameSet = new BehaviorSubject('');
  impersonateUserActive = new BehaviorSubject(false);

  constructor(private http: HttpClient) { 
  }

  getUsers(clientId:any, req?: any): Observable<any> {
    let u = new URLSearchParams(req).toString();
    const apiUrl = environment.baseApiEndPoint + clientId +'/impersonation/users?' + u;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  impersonateStart(username?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + 'auth/impersonate';
    return this.http.post<any>(apiUrl, { userName : username }).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  impersonateStop(username?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + 'auth/logout';
    return this.http.post<any>(apiUrl, "").pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  handleError(error: any): any {
    return throwError(error);
  }
}

