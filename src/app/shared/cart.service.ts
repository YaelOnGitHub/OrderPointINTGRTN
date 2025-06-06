

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MainService } from './services/main.service';
import { CartRequest, ItemRequest } from './_models/cartmodel';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  cartUpdate = new BehaviorSubject(false);
  itemInCart = new BehaviorSubject({
    quantity: 0,
    lastItem: null,
  });
  clientId = '';
  // click and ridirect selected ordertyo cart
  moveToCart = new BehaviorSubject(false);
  constructor(
    private http: HttpClient,
    private mainService: MainService
  ) {
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.clientId = currUser ? currUser.homeClientId : '';
    });
  }

  // getCARTDetailsFull(req?: any): Observable<any> {
  //   //let u = new URLSearchParams(req).toString();
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart';
  //   return this.http.get<any>(apiUrl).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

  // getChart(req?: any): Observable<any> {
  //   //let u = new URLSearchParams(req).toString();
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart/' + req;
  //   return this.http.get<any>(apiUrl).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Gets the list of addresses for the specified Sales rep
   * @param repId ID of the rep for whome to retrieve addresses
   * @returns List of addresses
   */
  getAddress(repId?: any): Observable<any> {

    //let u = new URLSearchParams(req).toString();
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/address' + (repId !== '' ? '?repId=' + repId : '');
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }
  /**
   * Updates the specified address
   * @param address Address to update
   * @returns
   */
  updateAddress(address: any, repId?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/address'+ (repId !== '' ? '?repId=' + repId : '');
    console.log('update', address);
    return this.http.put<any>(apiUrl, address).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  /**
   * Submits the order
   * @param req Shopping cart to submit as the order
   * @returns 
   */
  submitOrder(req: CartRequest): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/orders';
    return this.http.post<any>(apiUrl, req).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  // removeItem(cartId: number, itemId: number): Observable<any> {
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart/' + cartId + '/item/' + itemId;
  //   return this.http.delete<any>(apiUrl).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

  // cancelCart(cartId: number): Observable<any> {
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart/cancel/' + cartId;
  //   return this.http.put<any>(apiUrl, '').pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

  // updateQuantity(cartId: number, item?: any): Observable<any> {
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart/updatequantity';
  //   return this.http.put<any>(apiUrl, item).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

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