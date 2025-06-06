import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MainService } from './services/main.service';
import { addressRequest } from './_models/addressModel';

@Injectable({
  providedIn: 'root'
})

export class AddressService {
  clientId = '';
  constructor(private http: HttpClient, private mainService: MainService) {
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.clientId = currUser ? currUser.homeClientId : '';
    });
  }

  getCountryDropdown(): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + 'clients/' + this.clientId + '/country';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  addAddress(address: addressRequest): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/address';
    return this.http.post<any>(apiUrl, address).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  validateAddress(address: addressRequest): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/address/validate';
    return this.http.post<any>(apiUrl, address).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  removeItem(addressId: number): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/address/' + addressId;
    return this.http.delete<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  updateAddress(address: addressRequest): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/address';
    return this.http.put<any>(apiUrl, address).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  handleError(error: any): any {
    return throwError(error);
  }
}