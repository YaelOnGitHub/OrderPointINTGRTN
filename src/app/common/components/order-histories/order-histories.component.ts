import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { CartService } from 'src/app/shared/cart.service';
import { MainService } from 'src/app/shared/services/main.service';
import { OrderHistoryService } from 'src/app/shared/services/order-history.service';
import { ConfirmationComponent } from '../../modal/confirmation/confirmation.component';
import { FilterOrderDetailsComponent } from '../../modal/filter-order-details/filter-order-details.component';
import { ViewOrderDetailsComponent } from '../../modal/view-order-details/view-order-details.component';
import { ConfirmationReOrderComponent } from '../../modal/confirmation-reorder/confirmation-reorder.component';

@Component({
  selector: 'app-order-histories',
  templateUrl: './order-histories.component.html',
  styleUrls: ['./order-histories.component.scss']
})
export class OrderHistoriesComponent implements OnInit {  
  itemsPerPage = 3;
  totalItems: any;

  month: string = '3';  //active 3 month and selected bydefault
  selected: any;
  // p: any;
  pageRequest: any = {
    take: 3, skip: 0, page: 1,
    username: 'deb'
  };
  loading = true;
  loadingOD = true;
  formatedCount = 0;
  orders: any[] = [];
  ordersDetails: any;
  selectedTitle: string = '';
  selectedDate: any = '';

  model: any = {};
  currentUrl = '';
  filterForm?: FormGroup;


  validfilter = {
    month: false,
    customDate: false,
    typeSelected : false,
    statusSelected: false
  }
  constructor(public mainService: MainService, public translate: TranslateService, public router: Router, public cartService: CartService,
    private fb: FormBuilder, private spinner: NgxSpinnerService, public modelService: NgbModal, private orderHistoryService: OrderHistoryService) {
  }

  ngOnInit(): void {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let endDate = new Date();

    this.filterForm = this.fb.group({
      month: ['3'],
      search: [''],
      dateStart: [(startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear()],
      dateEnd: [(endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear()],
      selectDate: [''],
      type: [''],
      repId: [''],
      status: [''],
      take: 3, 
      skip: 0, 
      page: 1
    });
    
    this.getAllOrders({
      dateEnd: this.filterForm.value.dateEnd,
      dateStart: this.filterForm.value.dateStart
    }, this.pageRequest.page);
    this.mainService.triggerRemove.subscribe(data => {
      if (data) {
        this.remove();
      }
    });
  }

  getAllOrders(body: any, page: any): void {    
    this.spinner.show();
    
    const req:any = {};
    for (var p in body){
      switch(p){
        case 'month': //Filter out Select Date field in
        case 'selectDate': //Filter out Select Date field in
          break;
        default:
          req[p] = body[p];
          break;
      }
    }
    
    if (page) {
      req.page = page;
      req.skip = (page - 1) * this.pageRequest.take;
      req.take = this.pageRequest.take; 
    }
    
    this.orderHistoryService.getList(req).subscribe((res: any) => {next: {
      this.orders = res.data.map((item: any) => { return { ...item } });
      this.totalItems = res.total;
      this.formatedCount = this.orders.length;
      this.loading = false;
      this.spinner.hide();
    }}, error => {
      this.spinner.hide();
    });
  }

  reorder(orderId: any, orderType: any): void {
    this.spinner.show();
    this.orderHistoryService.reorder(orderId, orderType).subscribe((res: any) => {
      this.spinner.hide();
      this.loading = false;

      if (res.apiMessageCode) {
        let errorCodeTranslated = res.apiMessageCode;
        let productErrors: any[] = [];
        productErrors = res.productWiseError || [];
        this.displayGenericErrorMessageNew(errorCodeTranslated, productErrors, res);
      } else {
        this.continueReOrder(res);
      }

    }, error => {
      this.spinner.hide();
    });
  }

  itemAddInCart(items: any, orderType: number, forRepId:string, forTerritoryId:string) {
    const itemsFor = items.map((el: any) => {
      return {
        ...el,
        num: el.quantity
      }
    });
    if (forRepId) orderType = 5; //For a rep
    sessionStorage.setItem('productExistInCartSession', JSON.stringify(itemsFor));
    sessionStorage.setItem('orderTypeInCartSession', JSON.stringify(orderType));

    //If rep and territory included, then add to session
    if(forRepId) sessionStorage.setItem('repIdSelected', forRepId);
    if(forTerritoryId) sessionStorage.setItem('terIdSelected', forTerritoryId);
    
    this.cartService.cartUpdate.next(true);
    this.mainService.cartPageChange.next(true);
  }

  filterHistoryKeyUpHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.filterhistory(this.month);
    }
  }
  filterHistoryClickHandler(event: MouseEvent): void {
    this.filterhistory(this.month);
  }

  public filterhistory(month: string) {
    this.pageRequest.page = 0;
    this.mainService.triggerRemove.next(true);

    this.month = month;
    this.selected = '';

    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(month));

    let endDate = new Date();

    const body: any = {}
    if (parseInt(month) >= 0) {
      body.dateStart = (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear();
      body.dateEnd = (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear();

      this.filterForm?.patchValue({
        month: month,
        dateStart: body.dateStart,
        dateEnd: body.dateEnd,
        selectDate: '',
        type: '',
        status: [],
      });
      if (parseInt(month) !== 3) {
        this.validfilter.month = true;
      }
    }
    if (this.selectedTitle != '') {
      body.search = this.selectedTitle;
      this.filterForm?.patchValue({
        search: this.selectedTitle,
        type: '',
        status: [],
      });
    }
    
    let data = this.filterForm?.value
    this.getAllOrders(data,this.pageRequest.page);
  }

  changeDate(ev: any): void {
    this.selectedDate = ev;
    if (ev && ev.startDate != null && ev.endDate != null) {
      this.mainService.triggerRemove.next(true);
      this.validfilter.customDate = true;
      
      let startDate:Date = ev.startDate.toDate();
      let endDate:Date = ev.endDate.toDate();

      console.log('OPT-192 debugging', {'startDate': startDate, 'endDate':endDate, 'event':ev});

      //Fix for OPT-192 NaN appearing on Calendar days when user select Future Date.
      if (startDate > endDate) {
        endDate = startDate;
        this.selectedDate.endDate._d = endDate;
      }

      this.filterForm?.patchValue({
        month: '0',
        dateStart: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
        dateEnd: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
        type: '',
        status: [],
      });
      this.getAllOrders(this.filterForm?.value, this.pageRequest.page);
    }
  }

  public viewOrder(id: string, keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(ViewOrderDetailsComponent, { windowClass: 'order-history-view', centered: true, keyboard, backdrop });
    modal.componentInstance.sectionTypeHTML = 1;   // => Order-details
    modal.componentInstance.ordersID = id;
    // this.orderHistoryService.orderIdSubject.next(id)
  }

  public trackOrderOpen(id: string, keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(ViewOrderDetailsComponent, { windowClass: 'order-history-view', centered: true, keyboard, backdrop });
    modal.componentInstance.sectionTypeHTML = 2;   //2 => track-details
    modal.componentInstance.ordersID = id;
  }

  public filterOpen(keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(FilterOrderDetailsComponent, { windowClass: 'filter-view', centered: true, keyboard, backdrop });
    const body = this.filterForm?.value
    modal.componentInstance.filterData = body;
    modal.componentInstance.selected = this.selectedDate;
    modal.result.then((userResponse) => {
      if (userResponse) {
        this.filterForm?.patchValue(userResponse);
        this.month = userResponse.month;
        if (parseInt(this.month) > 0 || (this.month === '0' && userResponse.selectDate.endDate === null && userResponse.selectDate.startDate === null)) {
          this.filterForm?.patchValue({ selectDate: '' });
        }
        if (userResponse.type !== "") {
          this.validfilter.typeSelected = true;

        }
        if (parseInt(userResponse.month) > 3) {
          this.validfilter.month = true;
        }
        if (userResponse.status.length > 0) {
          this.validfilter.statusSelected = true;
        }
        // in case of all pass dates as null
        if (parseInt(this.month) == 0) {
          this.filterForm?.patchValue({ dateEnd: null, dateStart: null });
        }
        this.getAllOrders(this.filterForm?.value,this.pageRequest.page);
      }
      else {
        // console.log(userResponse)
      }
    }, (reason: any) => { });
  }

  remove(): void {
    const typeId = localStorage.getItem('oh-typeSelected')
    if (typeId != null) {
      localStorage.removeItem('oh-typeSelected');
    }
    const statusId = JSON.parse(localStorage.getItem('oh-statusSelected') as any)
    if (statusId != null || !statusId?.length) {
      localStorage.removeItem('oh-statusSelected');
    }
  }

  get haveFilter(): boolean {
    return this.validfilter.month || this.validfilter.customDate || this.validfilter.typeSelected || this.validfilter.statusSelected;
  }

  get f(): any {
    return this.filterForm?.controls
  }

  initialFilter(): void {
    this.mainService.triggerRemove.next(true);
    this.validfilter = {
      month: false,
      customDate: false,
      typeSelected : false,
      statusSelected: false
    }
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let endDate = new Date();

    this.filterForm?.patchValue({
      month: '3',
      search: '',
      dateStart: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
      dateEnd: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
      type: '',
      status: [],
      selectDate: ''
    });
    this.getAllOrders({
      dateEnd: this.filterForm?.value.dateEnd,
      dateStart: this.filterForm?.value.dateStart
    }, this.pageRequest.page);
  }

  public reorderOpen(keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
    modal.componentInstance.titleMain = 'Are you sure you wish to reorder same product?'
  }

  

  displayGenericErrorMessageNew(errorCode: string, productErrors: any[], response: any) {
    debugger;
    const genericModalRef = this.modelService.open(ConfirmationReOrderComponent,{ windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
    genericModalRef.componentInstance.onlyOK = response.items?.length == 0;
    const errorMessageKey = `orderHistory.apiMessageCode.${errorCode}`;

    let errorMessage = '';
      // Generate error message for each product error
      productErrors.forEach(error => {
        if (error.productId) {
          errorMessage += `<br/> <b>${error.productName} (${error.productId})</b>`;
        }
        if (error.apiMessageCode) {
          const productMessageKey = `orderHistory.apiMessageCode.${error.apiMessageCode}`;
            this.translate.get(productMessageKey).subscribe(msg => {
              errorMessage += ` - ${msg}<br/>`;
            });
        }
      });

      // Display error message to user (e.g., using toast or modal)
    this.translate.get(errorMessageKey).subscribe(msg => {
      genericModalRef.componentInstance.title = msg;
      genericModalRef.componentInstance.details = errorMessage;
      this.spinner.hide();
    });

    // if response has items then display dialog box 
if(response.items?.length > 0)
{
  genericModalRef.result.then((userResponse) => {
    if (userResponse) {
      //  Add all items to cart and return shooping cart  
      this.continueReOrder(response);
    }
  });
}
    
  }

  continueReOrder(res: any){
    if (JSON.parse(sessionStorage.getItem('productExistInCartSession') as any) !== null) {
      const modal = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard: true, backdrop: true });
      this.translate.get('orderHistory.reorderModel.msg').subscribe(resmsg => {
        modal.componentInstance.titleMain = resmsg;
      });
      modal.result.then((userResponse) => {
        if (userResponse) {
          //  Add all items to cart and return shooping cart  
          this.itemAddInCart(res.items, res.orderType, res.orderedForRepId, res.orderedForTerritoryId);
        }
      });
    } else {
      this.itemAddInCart(res.items, res.orderType, res.orderedForRepId, res.orderedForTerritoryId);
    }
  }

}
