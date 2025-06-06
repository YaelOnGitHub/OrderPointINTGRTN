import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MainService } from './main.service';


@Injectable({
  providedIn: 'root'
})

export class OrderHistoryService {

  orderIdSubject = new BehaviorSubject('0');
  clientId = '';

  constructor(private http: HttpClient, private mainService:MainService) {    
    this.mainService.getCurrentUser().subscribe(currUser => { 
      this.clientId = currUser.homeClientId;
     });
  }

  getList(req?: any): Observable<any> {
    let u = this.paramMaker(req);
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/orders?' + u;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  getID(id?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/orders/' + id;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  reorder(id: any, type:any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/orders/reorder/' + id + '/' + type;
    return this.http.post<any>(apiUrl, {}).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  getTrackDetails(id?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/orders/' + id;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  getStatuses() {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/orders/statuses';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  getTypes() {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/orders/ordertypes';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }
  handleError(error: any): any {
    return throwError(error);
  }
  paramMaker(data?: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: any) => {
          httpParams = httpParams.append(key + '[' + index + ']', item);
        });
      }
      else {
        httpParams = httpParams.append(key, data[key]);
      }
    });
    return httpParams;
  }
}
