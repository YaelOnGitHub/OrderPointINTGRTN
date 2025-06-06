import { Component, OnInit, Pipe, PipeTransform, Input, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailsComponent } from 'src/app/common/modal/product-details/product-details.component';
import { IItems, ItemsService } from 'src/app/shared/items.service';
import { UserControlService } from 'src/app/users/service/user-control.service';

import { CartService } from 'src/app/shared/cart.service';
import { CancelOrderComponent } from '../../modal/cancel-order/cancel-order.component';
import { environment } from 'src/environments/environment';
import { ConfirmationComponent } from '../../modal/confirmation/confirmation.component';
import { MainService } from 'src/app/shared/services/main.service';
import { productStatusEN, productStatusFR, periodTypeEN, periodTypeFR } from 'src/assets/i18n/options-lists.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuantitySelectorPipe } from '../../pipes/quantity-selector.pipe';
import { ToasterService } from 'src/app/shared/toaster.service';
import { TranslateService } from '@ngx-translate/core';
import { ResizeService } from 'src/app/shared/services/screen.resize.service';
import { SCREEN_SIZE } from 'src/ytbe/css/screen-size.enum';
import { WarningAddToCartComponent } from '../../modal/warning-addtocart/warning-addtocart.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [QuantitySelectorPipe]

})
export class ProductListComponent implements OnInit {
  themeVar = 'orange';
  itemsMenus: [] = [];
  baseApiEndPoint = environment.baseApiEndPoint;
  cartId = '';
  cartItems = []
  drop = false;
  p: any;
  selectedType = 'Availability'
  toastShow = false;
  productStatus = productStatusEN;  
  periodTypes = periodTypeEN;
  pageRequest: any = {
    take: 8, skip: 0, page: 1,
    orderType: null,
    // repId: null,
    // territoryId: "",
    // itemType: null,
    search: "",
    status: [],
    isNew: false,
    isDownloadable: false,
    itemtype: [],
    sort: [{ field: 'status', dir: 'asc' }] //Default
  }

  page = 1;
  itemsPerPage = 6;
  totalItems: any;

  selectedStatus: string = '[All]';
  selectedTitle: string = '';
  @Input() public selectedSort: any = 'status';
  productSort = [
    { value: "status", title: "Availablity", class: "available", checked: false },
  ];
  addToCartLastValue: any;
  products: any[] = [];
  loading: boolean = true;
  formatedCount: number | undefined;
  cartProductList: any = [];
  user: any;
  clientId = '';
  allowChangeOrderType: boolean = true;
  size : any = '';
  screenSizes: any = SCREEN_SIZE;
  isSearchRequest: boolean = false;  
  enableDisplayPediodLabel = false;
  enableDTPDeductRule = false;
  enabledUsageLabelOnDashboard = false;

  constructor(private spinner: NgxSpinnerService,
    private mainService: MainService,
    private cartService: CartService,
    private userControl: UserControlService,
    private itemService: ItemsService,
    public modelService: NgbModal,
    private renderer: Renderer2,
    private quantityPipe: QuantitySelectorPipe,
    private _toast: ToasterService,
    public translate: TranslateService,
    private resizeSvc: ResizeService) {

    // current theme check
    this.mainService.currentTheme.subscribe(res => {
      this.themeVar = res;
    });

    this.formatedCount = this.products.length;
    this.renderer.removeClass(document.body, 'en-auth-login');

    this.mainService.languageChange.subscribe(data => {
      this.productStatus = data === 'fr' ? productStatusFR : productStatusEN;
      this.periodTypes = data === 'fr' ? periodTypeFR : periodTypeEN;
    });
    
    // default status on pre-load
    let defaultProductStatus: number[] = [];
    const storedDefaultProductStatus = sessionStorage.getItem('defaultProductStatus');
    if (storedDefaultProductStatus) {
            defaultProductStatus = JSON.parse(storedDefaultProductStatus).sort((a: any, b: any) => a - b);
    }
    this.resizeSvc.onResize$.subscribe(x => {      
      if(x !== this.size) 
      {
        this.size = x;
        this.pageRequest.take = 8;
        this.getAllItems(null, defaultProductStatus);
      }          
    });

    this.resizeSvc.onLoad$.subscribe(x => {      
      if(x !== this.size)
      {
        this.size = x;
        this.pageRequest.take = 8;
        this.getAllItems(null, defaultProductStatus);
      }             
    });

  }


  ngOnInit(): void {    

    this.enableDTPDeductRule = Boolean(sessionStorage.getItem('ruleDeductDTPEnabled')) || false;
    this.mainService.getCurrentUser().subscribe(currUser => {
      this.user = currUser;
      this.clientId = this.user ? this.user.homeClientId : '';
    });
    //Get external data (if it was passed)
    this.mainService.getExternalData().subscribe(data => {
      if (data?.fromGskGrc == false) {

        let orderId = sessionStorage.getItem('orderTypeInCartSession') ?? '4';
        
        if(orderId > '4' || orderId < '3' )          
          orderId = '4';

        this.userControl.allowedOrderTypes.next({
          selected: orderId,
          allowed: ['3', '4']
        }); //Force order type to Vaccine
        this.pageRequest.orderType = orderId;
      }
    });
    
    this.userControl.cartHaveOrderType.subscribe(data => {
      if (data !== '') {
        this.pageRequest.orderType = data
      }
    });
    this.userControl.initFilter.subscribe(res => {

      this.page = 1;
      this.pageRequest.skip = 0;
      this.pageRequest.page = 1;
    });
    
    this.enableDisplayPediodLabel = Boolean(sessionStorage.getItem('enableDisplayPediodLabel'));
    this.enabledUsageLabelOnDashboard = Boolean(sessionStorage.getItem('enabledUsageLabelOnDashboard'));

    this.userControl.sidebarFilterControl.subscribe((filter: any) => {
      
      this.pageRequest = filter;
      this.pageRequest.sort = [{ field: this.selectedSort, dir: 'asc' }];
      this.getAllItems();

    });
    this.cartService.itemInCart.subscribe(res => {
      this.addToCartLastValue = res;
      this.toastShow = true;
    });
    this.itemService.productListUpdate.subscribe(res => {
      if (res) {
        this.getAllItems();
      }
    });
  }

  getAllItems(page?: any, defaultStatus?:any) {
    this.spinner.show();
    if(this.pageRequest.orderType === "5" && 
    ((this.pageRequest.territoryId === undefined || this.pageRequest.territoryId === "") || 
    (this.pageRequest.repId === undefined || this.pageRequest.repId === "")))
    {
        this.totalItems = 0;
        this.formatedCount = 0;
        this.loading = false;
        this.spinner.hide();
        this.products = [];
        return;
    }

    if(this.size !== '')
    {      
      this.pageRequest.take  = this.size == this.screenSizes.MD || this.size == this.screenSizes.LG ? 9 : this.pageRequest.take;
      if (page) {
        this.pageRequest.page = page;
        this.pageRequest.skip = (page - 1) * this.pageRequest.take;
      }
      this.loading = true;
      const body = this.pageRequest;

      
     
      
      if(defaultStatus !== undefined && defaultStatus.length > 0)  
        body.status = defaultStatus;  
      else
      {
        if (body?.status?.length === 0 || body?.status === null) {
          delete body.status;
        }
      }

    if (body.itemtype?.length === 0) {
      delete body.itemtype;
    }

      if(body.search && !this.isSearchRequest)
      {
        body.skip = 0;
        this.pageRequest.page = 1;
        this.isSearchRequest = true;
      }
      
      if(!body.search && this.isSearchRequest)      
      {
        body.skip = 0;
        this.pageRequest.page = 1;
        this.isSearchRequest = false;
      }

      body.ruleDeductDTPEnabled = this.enableDTPDeductRule;

      this.itemService.getItems(body).subscribe(res => {

        let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any)
        this.cartProductList = items ? items : [];
        this.products = res.data.map((item: any) => {
          let finItem = this.cartProductList.find((cartItem: any) => cartItem.id === item.id);
          let finIndex = this.cartProductList.indexOf(finItem);
          return {
            ...item,
            addedToCart: finItem ? true : false,
            quantity: finIndex >= 0 ? this.cartProductList[finIndex].quantity : item.increment
          }
        });
        this.totalItems = res.total;
        this.formatedCount = this.products.length;
        this.loading = false;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });
    }
  }
  updateItems() {
    let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any)
    this.cartProductList = items ? items : [];
    this.products.forEach((item: any) => {
      let finItem = this.cartProductList.find((cartItem: any) => cartItem.id === item.id);
      let finIndex = this.cartProductList.indexOf(finItem);
      item.addedToCart = finItem ? true : false;
      item.quantity = finIndex >= 0 ? this.cartProductList[finIndex].quantity : item.increment
    });
  }


  async addTocart(item: any, itemID: any, quantity: number = 1) {    
    if(this.validationChecks(item) == false) {      
      item.addedToCart = false;
      return;
    }

    const isValidLifetimeCheck = await this.validationLifetimePeriodCheck(item);
    if (!isValidLifetimeCheck) {
      item.addedToCart = false;
      return;
    }

    item.addedToCart = true;
    let body = {
      orderType: this.pageRequest.orderType,
      item: {
        ...item,
        id: itemID,
        quantity: quantity,

      },
      repId: this.pageRequest.repId
    }

    if (this.pageRequest.orderType !== '5') {
      delete body?.repId;
    }
    sessionStorage.setItem('orderTypeInCartSession', this.pageRequest.orderType ? this.pageRequest.orderType.toString() : '');
    this.itemService.addCart(body);

    // .subscribe(res => {
    //   // console.log(res);
    this.cartService.cartUpdate.next(true);
    this.getAllItems();
    // });
  }

  validationChecks(item: any, keyboard = true, backdrop: boolean | 'static' = true) {
    // hard code changes for certain production for SUPER
    if(this.clientId == 'SUPER' && (item.id == "GOC-0528"
    || item.id == "GOC-0529"
    || item.id == "GOC.2023-0056"
    || item.id == "MDD000001430-1")) {
      // display poup message
      this.translate.get("warningAddToCartModal.warningMessageSuper").subscribe(msg => {
        const warningMissingRef = this.modelService.open(WarningAddToCartComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
        warningMissingRef.componentInstance.title = msg;
        warningMissingRef.componentInstance.onlyOK = true;
        warningMissingRef.result.then((userResponse) => { });
      });
      return false;
    }
    return true;
  }

  validationLifetimePeriodCheck(item: any, keyboard = true, backdrop: boolean | 'static' = true): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.enableDisplayPediodLabel) {
        if (item.periodLabel === 6) { // assuming 6 is the code for Lifetime
          // Display popup message
          this.translate.get("warningAddToCartLifetimeModal.warningMessage").subscribe(msg => {
            const warningMissingRef = this.modelService.open(WarningAddToCartComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
            warningMissingRef.componentInstance.title = msg;
            warningMissingRef.componentInstance.onlyOK = true;
            warningMissingRef.componentInstance.okayButtonText = 3;
            
            warningMissingRef.result.then((userResponse) => {
              if (userResponse) {
                resolve(true);  // Continue adding to cart
              } else {
                resolve(false); // Do not add to cart
              }
            }, () => {
              resolve(false); // Do not add to cart on modal dismissal
            });
          });
        } else {
          resolve(true);  // Continue if periodLabel is not 3
        }
      } else {
        resolve(true);  // Continue if enableDisplayPediodLabel is false
      }
    });
  }
  

  updateCart(item: any, itemID: any, ev: any, num = false) {
    const listItem = this.quantityPipe.transform([], item).indexOf(!num ? Number(ev.target.value) : ev) >= 0;
    // if(listItem){
    const body = {
      ...item,
      id: itemID,
      quantity: !num ? Number(ev.target.value) : ev,
      repId: this.pageRequest.repId
    }

    if (this.pageRequest.orderType !== '5') {
      delete body?.repId;
    }

    this.products = this.products.map(el => {
      return {
        ...el,
        quantity: el.id === itemID ? !num ? Number(ev.target.value) : ev : el.quantity
      }
    });
    this.itemService.updateCart(body);
    // .subscribe(res => {
    //   // console.log(res);
    this.cartService.cartUpdate.next(true);
    this.updateItems(); //Update items to reflect possible removal of item
    //   this.getAllItems();
    // });
    // }else{
    //   this.translate.get('quantityError').subscribe(msg => {
    //     this._toast.showError('msg', 'ERROR');
    //   });

    // }
  }

  downloadFile(fileID: any): void {
    window.open(this.baseApiEndPoint + this.clientId + '/files/download/' + fileID);
  }

  noDownload(): void {
    const modal = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard: true, backdrop: true });
    modal.componentInstance.titleMain = "This product doesn't have the downloadable file.";
    modal.componentInstance.onlyOK = true;
  }

  searchTitleKeyUpHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.getAllItems();
    }
  }
  searchTitleClickHandler(event: MouseEvent): void {
    this.getAllItems();
  }

  selectSort(s: any) {
    this.selectedSort = s;
    this.getAllItems();
  }


  public productDetails(item: any, keyboard = true, backdrop: boolean | 'static' = true) {
    window.scrollTo(0, 0);
    const modal = this.modelService.open(ProductDetailsComponent, { windowClass: 'filter-view', centered: true, keyboard, backdrop });
    modal.componentInstance.productDetails = item;
    modal.componentInstance.orderType = this.pageRequest.orderType;
    modal.componentInstance.repId = this.pageRequest.repId;

    this.itemService.addToCartActiveOnProduct.next(item.addedToCart);
  }


  moveToCart() {
    this.cartService.moveToCart.next(true);
  }
  cartEmpty() {
    sessionStorage.removeItem('productExistInCartSession');
    this.cartService.cartUpdate.next(true);
    this.getAllItems();
  }
}


// Status Product
@Pipe({
  name: 'productStatusFilters'
})
export class ProductStatusFilterPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter || filter === '0') {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.value === filter + '');
    // return items.filter(item => item.status.indexOf(filter.status) !== -1);
  }

}


// Status Product
@Pipe({
  name: 'periodLabelFilters'
})
export class PeriodLabelFilterPipe implements PipeTransform {

  transform(items: any[], filter: Object): any {
    if (!items || !filter || filter === '0') {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.periodType === filter + '');
    // return items.filter(item => item.status.indexOf(filter.status) !== -1);
  }

}
