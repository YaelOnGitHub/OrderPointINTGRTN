import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  clientId = '';

    constructor(private http: HttpClient, private mainService:MainService) {    
      this.mainService.getCurrentUser().subscribe(currUser => {
        this.clientId = currUser ? currUser.homeClientId : '';
      });    
    }
  
    private selectedProductSource = new BehaviorSubject<string | null>(null);
    selectedProduct$ = this.selectedProductSource.asObservable();
  
    setSelectedProduct(productId: string) {
      this.selectedProductSource.next(productId);
    }
  
     getTeamItems(ruleDeductDTPEnabled?: any): Observable<any> {
        const apiUrl = environment.baseApiEndPoint + this.clientId + '/items/getTeamItems?ruleDeductDTPEnabled=' + ruleDeductDTPEnabled;
        return this.http.get<any>(apiUrl).pipe(
          tap((data) => data),
          catchError(this.handleError)
        );
      }


      fetchProductUsage(params: { productId: any; startDate: any; endDate: any; }): Observable<any> {
        const apiUrl = environment.baseApiEndPoint + this.clientId + '/items/fetchProductUsage';
        return this.http.post<any>(apiUrl, params).pipe(
          tap((data) => data),
          catchError(this.handleError)
        );
      }

      handleError(error: any): any {
        return throwError(error);
      }
}
