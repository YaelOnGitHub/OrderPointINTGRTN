import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MainService } from './services/main.service';
import { TransferRequest } from 'src/app/shared/_models/transferRequest';
 
@Injectable({
  providedIn: 'root'
})

export class TransferService {
  cartProductList: any = [];
  addToCartActiveOnProduct = new BehaviorSubject(false);
  productListUpdate = new BehaviorSubject(false);
  clientId = '';
  constructor(private http: HttpClient, private mainService:MainService) {    
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.clientId = currUser ? currUser.homeClientId : '';
    });    
  }
 
  getSaleReps(): Observable<any[]> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/users/get-reps';
    return this.http.get<any[]>(apiUrl).pipe(
      map((reps: any[]) => reps.map(rep => ({
        id: rep.id,
        text: `${rep.firstName} ${rep.lastName} - ${rep.territoryId}`
      }))),
      catchError(this.handleError)
    ) as Observable<any[]>; // Explicitly specify the return type
  }


  geTransferHistories(req?: any): Observable<any> {
    let u = this.paramMaker(req);
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/transfer-items/history?' + u;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }
  
  getProductsWithDTPInfomation(req: any): Observable<any[]> {
    let u = this.paramMaker(req);
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/transfer-items?' + u;
    return this.http.get<any[]>(apiUrl).pipe(
      map((response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          return response.data.map((product: any) => ({
            id: product.productId,
            text: `${product.productName} - ${product.productId}`,
            availableQuantity: product.availableQuantity,
            max_quantity :product.availableQuantity,
            increment : 1,
            selectedQuantity: 1
          }));
        } else {
          // Handle invalid response format
          throw new Error('Invalid API response format');
        }
      }),
      catchError(this.handleError)
    ) as Observable<any[]>; // Explicitly specify the return type
  } 

  getTransferEligiblity(req?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/transfer-items/transfer-eligiblity';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  submitTransfer(req: TransferRequest): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/transfer-items/transfer';
    return this.http.post<any>(apiUrl, req).pipe(
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
          let arrKey = key + '[' + index + ']';
          if (typeof(item) === 'object'){ //Handle nested object (Ex: sort field)
            Object.keys(item).forEach((itemKey) => {              
              httpParams = httpParams.append(arrKey + '[' + itemKey +']', item[itemKey]);
            });
          } else {
            httpParams = httpParams.append(arrKey, item);
          }
        });
      }
      else {
        httpParams = httpParams.append(key, data[key]);
      }
    });
    return httpParams;
  }
}

