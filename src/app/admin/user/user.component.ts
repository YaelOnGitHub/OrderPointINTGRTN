import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '@bcodes/ngx-theme-service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/shared/cart.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { MainService } from 'src/app/shared/services/main.service';
import { UserControlService } from 'src/app/users/service/user-control.service';
import { ConfirmationComponent } from '../../common/modal/confirmation/confirmation.component';

export interface User {
  addressLine1: string;
  city: string;
  country: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  roles: string;
  state: string;
  teamId: string;
  teamName: string;
  territoryName: string;
  username: string;
  zip: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  p: any;
  page = 1;
  pageRequest: any = {
    take: 8, skip: 0, page: 1,
    search: ''
  };
  loading = true;
  clientId = '';
  formatedCount = 0;
  totalItems = 0;
  users: User[] = [];
  impersonatingUser: any;
  allowedClientOrderTypes : number[] = JSON.parse(sessionStorage.getItem('allowedOrderTypes') as any).sort(function(a :any, b:any){return a-b}); 

  constructor(private spinner: NgxSpinnerService, 
    public userControl: UserControlService, 
    private cart: CartService, 
    private mainService: MainService, 
    public themeService: ThemeService, 
    public modelService: NgbModal, 
    public translate: TranslateService, 
    public router: Router, 
    public adminService: AdminService) { }

  ngOnInit(): void {
    // this.adminService.impersonateUserActive.next(false);
    // console.log('users_sections');
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.clientId = currUser.homeClientId;
      if (currUser?.impersonator === '') {
        this.getAllUsers(this.clientId);
        this.getCurrentTheme();  
      }
      else {
        this.stopImpersonate();
      }
    });
  }

  
  stopImpersonate(): void {
    this.spinner.show();
    let filterSelection = {
      orderType: '',
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
    this.userControl.sidebarFilterControl.next(filterSelection);
    this.userControl.repSelected.unsubscribe();
    sessionStorage.setItem('productExistInCartSession', JSON.stringify([]));
    sessionStorage.setItem('orderTypeInCartSession', this.allowedClientOrderTypes[0].toString());
    sessionStorage.removeItem('terms');
    sessionStorage.removeItem('repIdSelected');
    sessionStorage.removeItem('terIdSelected');

    this.mainService.getCurrentUser().subscribe(currUser => {
      this.impersonatingUser = currUser;
      this.adminService.impersonateStop(this.impersonatingUser?.impersonator).subscribe(data => {
        this.spinner.hide();
        localStorage.setItem('identity', JSON.stringify(data));
        this.adminService.userNameSet.next(data?.firstName + ' ' + data?.lastName);
        this.adminService.impersonateUserActive.next(false);
        this.getAllUsers(this.clientId);
        this.getCurrentTheme();  
      }, error => {
        this.spinner.hide();
      });

    });
  }

  getCurrentTheme(): any {
    this.mainService.getThemeType.subscribe(data => {
      if (data.themeType === 0) {
        this.mainService.currentTheme.next('dark');
        this.themeService.switchTheme('dark');
      }
      if (data.themeType === 1) {
        this.mainService.currentTheme.next('light');
        this.themeService.switchTheme('light');
      }
      if (data.themeType === 2) {
        this.mainService.currentTheme.next('dark');
        this.themeService.switchTheme('dark');
      }
    });
  }

  searchUsersKeyUpHandler(event: KeyboardEvent){
    if (event.key === 'Enter') {
      this.getAllUsers(this.clientId, 1);   
    } 
  }
  searchUsersClickHandler(event: MouseEvent): void {
    this.getAllUsers(this.clientId, 1);
  }
  getAllUsers(clientId: any, page?: any) {
    this.spinner.show();
    if (page) {
      this.pageRequest.page = page;
      this.pageRequest.skip = (page - 1) * this.pageRequest.take;
    }
    this.loading = true;
    const body = this.pageRequest;

    this.adminService.getUsers(clientId, body).subscribe(res => {
      this.spinner.hide();
      this.users = res.data.map((item: any) => { return { ...item, addTocart: false } });
      this.totalItems = res.total;
      this.formatedCount = this.users.length;
      this.loading = false;
    }, error => {
      this.spinner.hide();
    });
  }

  loginWithImpersonate(user: any) {
    this.adminService.impersonateStart(user?.username).subscribe(
        data => {
          // console.log(data);
          localStorage.setItem('identity', JSON.stringify(data));
          const currentLang = this.translate.currentLang;
          this.userControl.repSelected = new BehaviorSubject('');
          this.router.navigateByUrl(currentLang + '/homeoffice/impersonating');
          this.adminService.impersonateUserActive.next(true);
          this.adminService.userNameSet.next(user?.firstName + ' ' + user?.lastName);
          this.cart.cartUpdate.next(true);
        },
        error => {
          this.translate.get('impersonate.error').subscribe(translateMsg => {
            let msg = error.error || translateMsg;
            const modal = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard: true, backdrop: true });
            modal.componentInstance.titleMain = msg;
            modal.componentInstance.onlyOK = true;
              console.log(error);
          });
        }
    );
  }

}
