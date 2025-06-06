import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from 'src/app/shared/cart.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { MainService } from 'src/app/shared/services/main.service';
import { UserControlService } from 'src/app/users/service/user-control.service';
import { environment } from 'src/environments/environment';
import { Role } from '../../../shared/_models';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  baseApiEndPoint = environment.baseApiEndPoint;
  orderType = '';
  cartCountHeader = 0;
  userMenus: any[] = [];
  @Input() typeUser: any;
  @Input() impersonating: boolean = false;
  user: any;
  clientId = '';
  clientName = '';
  impersonatingUser: any;
  filterSelection = {
    orderType: '',
    take: 8, skip: 0, page: 1,
    // repId: null,
    // territoryId: "",
    status: [],
    search: "",
    isNew: false,
    isDownloadable: false,
    itemtype: [],
    repId: '', territoryId: ''

  };
  isImpersonateActive = false;
  userFullName: string | undefined;
  normalUser: string | undefined;
  cartProductList: any = [];
  logoImageUrl: string = '';
  allowedClientOrderTypes : number[] = JSON.parse(sessionStorage.getItem('allowedOrderTypes') as any)?.sort(function(a :any, b:any){return a-b});
  allowedTransfer = false;
  isSaleRepRole = true;
  isManagerRole : boolean = false;
  enabledTeamPage: boolean = false;

  constructor(private themeService: ThemeService,
    private spinner: NgxSpinnerService,
    public mainService: MainService,
    public as: AdminService,
    public cart: CartService,
    public translate: TranslateService,
    protected router: Router,
    public modelService: NgbModal,
    public userControl: UserControlService) {

    this.as.impersonateUserActive.subscribe((res: any) => {
      this.isImpersonateActive = res;
      this.isSaleRep();
    });

    this.userControl.sidebarFilterControl.subscribe(data => {
      this.orderType = data.orderType;
    });

    this.userControl.cartHaveOrderType.subscribe(data => {
      this.orderType = data;
    });

    this.cart.cartUpdate.subscribe(data => {
      if (data) {
        this.getCartDetails();
      }
    });

    this.cart.moveToCart.subscribe(res => {
      if (res) this.cartOpen();
    });

    this.as.userNameSet.subscribe(user => {
      this.userFullName = user;
    });

    this.mainService.cartPageChange.subscribe(data => {
      if (data) {
        this.cartOpen();
      }
    });

  }

  ngOnInit(): void {
    // this.getUserMenu();
    this.getCartDetails();
    this.mainService.getCurrentUser().subscribe(u => {
      this.user = u;

      //Get the current user information
      this.logoImageUrl = this.user.getHomeClient().logoImageUrl;
      this.clientName = this.user.getHomeClient().name;

      let rank = u.getHomeRole().rank;
      this.isSaleRepRole = rank == Role.SalesRep;
      this.isManagerRole = rank == Role.DistrictManager;
    });

    this.clientId = this.user ? this.user.homeClientId : '';
    this.impersonatingUser = this.user;
    this.userFullName = this.impersonatingUser?.firstName + ' ' + this.impersonatingUser?.lastName;
    this.allowedTransfer = Boolean(sessionStorage.getItem('allowedTransfer'));
    this.enabledTeamPage = Boolean(sessionStorage.getItem('enabledMyTeamPage'));
  }

  logout() {
    this.mainService.logOut();

    this.mainService.clientId.unsubscribe();
    this.userControl.repSelected.unsubscribe();
    this.userControl.sidebarFilterControl.unsubscribe();
    this.mainService.getThemeType.unsubscribe();
  }

  getUserMenu() {
    this.userControl.getListOfMenu(this.typeUser).subscribe((data: any) => {
      this.userMenus = data;
    });
  }

  stopImpersonate(): void {
    this.spinner.show();
    let filterSelection = {
      orderType: '1',
      take: 8, skip: 0, page: 1,
      status: [],
      search: "",
      isNew: false,
      isDownloadable: false,
      itemtype: [],
      repId: '', territoryId: ''
    }
    this.userControl.sidebarFilterControl.next(filterSelection);
    this.userControl.repSelected.unsubscribe();
    sessionStorage.setItem('productExistInCartSession', JSON.stringify([]));
    sessionStorage.setItem('orderTypeInCartSession', this.allowedClientOrderTypes[0].toString());
    sessionStorage.removeItem('terms');
    sessionStorage.removeItem('repIdSelected');
    sessionStorage.removeItem('terIdSelected');

    this.mainService.getCurrentUser().subscribe(currUser => {
      this.impersonatingUser = currUser;
      this.as.impersonateStop(this.impersonatingUser?.impersonator).subscribe(data => {
        this.spinner.hide();
        // console.log(data);
        localStorage.setItem('identity', JSON.stringify(data));
        this.as.userNameSet.next(data?.firstName + ' ' + data?.lastName);
        this.as.impersonateUserActive.next(false);
        this.router.navigateByUrl(this.translate.currentLang + '/homeoffice');
      }, error => {
        this.spinner.hide();
      });

    });
  }

  isSaleRep(){
    this.mainService.getCurrentUser().subscribe(u => {
      let rank = u.getHomeRole().rank;
      this.isSaleRepRole = rank == Role.SalesRep;
      this.isManagerRole = rank == Role.DistrictManager;
    });
  }

  getCartDetails() {
    // this.cart.getCARTDetailsFull().subscribe(data => {
    let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any);
    let orderType = JSON.parse(sessionStorage.getItem('orderTypeInCartSession') as any)
    this.cartProductList = items ? items : [];

    if (this.cartProductList.length !== 0) {
      // this.cart.getChart(data).subscribe(data => {
      // if (data.items.length > 0) {
      let sum = 0;
      for (let index = 0; index < this.cartProductList.length; index++) {
        sum += this.cartProductList[index].quantity;
      }
      this.cartCountHeader = sum; // total quantity

      if (this.cartProductList.length > 0) {

        this.userControl.cartHaveOrderType.next(orderType ? orderType.toString() : '');
        this.cart.itemInCart.next({
          quantity: sum, // total quantity
          lastItem: this.cartProductList[this.cartProductList.length - 1],
        });
      }

      if (this.cartProductList.length === 0) {
        this.userControl.cartHaveOrderType.next('1');
        this.cart.itemInCart.next({
          quantity: 0,
          lastItem: null,
        });
      }
      // }
      // }
      // });
    } else {
      this.cartCountHeader = 0;
      this.userControl.cartHaveOrderType.next('');
      this.cart.itemInCart.next({
        quantity: 0,
        lastItem: null,
      });
    }
    // });
  }

  userMenuClick(url: string) {
    const currentLang = this.translate.currentLang;
    switch (url) {
      case '/order-history':
        this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/order-history']);
        break;
      case '/transfer-history':
        this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/transfer-history']);
        break;
      case '/my-dtp-limits':
        this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/my-dtp-limits']);
        break;
      case '/dashboard':
        this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/dashboard']);
        break;
      case '/':
        this.router.navigate(['./' + currentLang + '/homeoffice']);
        break;
      case 'impersonating/order-history':
        this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/order-history']);
        break;
      case 'impersonating/homeoffice':
        this.router.navigate(['./' + currentLang + '/' + this.getRole()]);
        break;
      case '/my-team':
        this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/my-team']);
        break;  
        case 'impersonating/my-team':
        this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/my-team']);
        break; 
      default:
        break;
    }
  }

  langChangeClick(lang: string) {
    this.mainService.triggerRemove.next(true);
    this.mainService.languageChange.next(lang);
    this.mainService.setLanguage(lang);
  }

  cartOpen() {
    const currentLang = this.translate.currentLang;
    if (this.cartCountHeader > 0){
      switch (this.orderType) {
        case '1':
          this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/cart']);
          break;
        case '2':
          this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/cart-convention-shipment']);
          break;
        case '3':
          this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/cart-drop-shipment']);
          break;
        case '4':
          this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/cart-drop-shipment']);
          break;
        default:
          this.router.navigate(['./' + currentLang + '/' + this.getRole() + '/cart']);
          break;
      }
    }
  }

  getRole(): string {

    if (this.typeUser === 'Manager') {
      return 'manager' + (this.isImpersonateActive ? '/impersonating' : '');
    }
    if (this.typeUser === 'Admin') {
      return 'homeoffice' + (this.isImpersonateActive ? '/impersonating' : '');
    }
    if (this.typeUser === 'Normal User') {
      return 'users' + (this.isImpersonateActive ? '/impersonating' : '');
    }
    return '';
  }
}
