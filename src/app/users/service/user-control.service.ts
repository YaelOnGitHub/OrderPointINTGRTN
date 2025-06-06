import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, map, throwError } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';
import { environment } from 'src/environments/environment';
import { TiAuthService } from 'src/titanium/ti-auth.service';
import { AuthService } from 'src/ytbe/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserControlService {
  filterSelection = {
    orderType: "",
    take: 8, skip: 0, page: 1,
    // repId: null,
    // territoryId: "",
    // status: '',
    status: [],
    search: "",
    isNew: false,
    isDownloadable: false,

    itemtype: [],

    repId: '', territoryId: ''
  }

  statusFilterChange = new BehaviorSubject('');

  initFilter = new BehaviorSubject(false)

  sidebarFilterControl = new BehaviorSubject(this.filterSelection);

  repSelected = new BehaviorSubject('');
  terSelected = new BehaviorSubject('');
  // main-header
  cartHaveOrderType = new BehaviorSubject('');


  allowedOrderTypes = new BehaviorSubject<{selected:string, allowed:string[]}>({selected:'',allowed:[]});

  showAiExpert = new BehaviorSubject<boolean>(false);

  constructor(public http: HttpClient, @Inject(AuthService) private authService: TiAuthService,
    ) {
    let orderType = JSON.parse(sessionStorage.getItem('orderTypeInCartSession') as any);
    sessionStorage.setItem('orderTypeInCartSession', orderType ? orderType.toString() : '1');
    if (orderType === 5) {
      let rIds = sessionStorage.getItem('repIdSelected');
      let tId = sessionStorage.getItem('terIdSelected');
      this.filterSelection.repId = rIds ? rIds.toString() : '';
      this.filterSelection.territoryId = tId ? tId.toString() : '';
    } else {
      sessionStorage.removeItem('repIdSelected');
      sessionStorage.removeItem('terIdSelected');
      this.filterSelection.repId = '';
      this.filterSelection.territoryId = '';
    }
    this.cartHaveOrderType.next(orderType ? orderType.toString() : '1');
    this.filterSelection.orderType = orderType ? orderType.toString() : '1';
    this.sidebarFilterControl.next(this.filterSelection);
  }

  getListOfMenu(role: string) {
    return this.authService.getCurrentUser().pipe( 
      map(
        currUser => {
          let clientId = currUser ? currUser.homeClientId : '';
          const apiUrl = environment.baseApiEndPoint + clientId + '/users/menu?role=' + role;
          return this.http.get<any>(apiUrl).pipe(
            tap((data) => data),
            catchError(this.handleError)
          );
      } 
      )
    );
  }


  handleError(error: any): any {
    return throwError(error);
  }

}
