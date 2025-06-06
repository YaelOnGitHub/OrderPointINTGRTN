import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MainService } from './services/main.service';

export interface IItems {
  id: string;
  ndc: string;
  name: string;
  category: 0,
  type: string;
  isColdChain: boolean;
  requiresApproval: boolean;
  userLimit: number;
  limit: number;
  ordered: number;
  expiresOn: string;
  status: number;
  thumbnailURL: string;
  previewURL: "../../../assets/img/home/1.png",
  available: number;
  userOnHand: number;
  incrementsOfUnitsPerPackage: boolean;
  unitCost: number;
  packageCost: number;
}
@Injectable({
  providedIn: 'root'
})

export class ItemsService {
  cartProductList: any = [];
  addToCartActiveOnProduct = new BehaviorSubject(false);
  productListUpdate = new BehaviorSubject(false);
  clientId = '';
  constructor(private http: HttpClient, private mainService:MainService) {    
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.clientId = currUser ? currUser.homeClientId : '';
    });    
  }

  getItems(req?: any): Observable<any> {
    let u = this.paramMaker(req);
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/items?' + u;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  getBrands(req?: any): Observable<any> {
    let u = this.paramMaker(req);
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/items/getbrands?' + u;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  getCart(req?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  // addCart(body?: any): Observable<any> {
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart/additem';
  //   return this.http.post<any>(apiUrl, body).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }
  addCart(body?: any): void {
    let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any)
    this.cartProductList = items ? items : [];
    let productExistInCart = this.cartProductList.find((item: any) => item === body.item.id); // find product by id
    if (!productExistInCart) {
      this.cartProductList.push({ ...body.item, quantity: body.item.quantity }); 
      sessionStorage.setItem('productExistInCartSession', JSON.stringify(this.cartProductList));
      return;
    }
    productExistInCart.quantity += body.item.increment;
  }

  // updateCart(body?: any): Observable<any> {
  //   const apiUrl = environment.baseApiEndPoint + this.clientId + '/cart/updatequantity';
  //   return this.http.put<any>(apiUrl, body).pipe(
  //     tap((data) => data),
  //     catchError(this.handleError)
  //   );
  // }

  updateCart(body?: any): void {
    let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any)
    this.cartProductList = items ? items : [];
    console.log('items', items);
    let productExistInCart = this.cartProductList.find((item: any) => item.id === body.id);
    if (productExistInCart) {
      let indexProduct = this.cartProductList.indexOf(productExistInCart);
      if (body.quantity){
        this.cartProductList[indexProduct].quantity = body.quantity; 
      } else {
        this.cartProductList.splice(indexProduct, 1);
      }
      sessionStorage.setItem('productExistInCartSession', JSON.stringify(this.cartProductList));
      return;
    }
    productExistInCart.quantity += body.quantity;
  }
  downloadFile(fileID: any) {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/files/download/' + fileID;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }


  getItem(req?: any): Observable<any> {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/items/item?itemid=' + req;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }

  
  getItemHistory(req?: any): Observable<any> {
    let u = this.paramMaker(req);
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/items/history?' + u;
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      catchError(this.handleError)
    );
  }



  getReps() {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/users/reps';
    return this.http.get<any>(apiUrl).pipe(
      tap((data) => data),
      map((data) => data.data),
      catchError(this.handleError)
    );
  }

  getTerritories() {
    const apiUrl = environment.baseApiEndPoint + this.clientId + '/territories';
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

