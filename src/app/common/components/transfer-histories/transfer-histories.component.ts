import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from 'src/app/shared/cart.service';
import { MainService } from 'src/app/shared/services/main.service';
import { OrderHistoryService } from 'src/app/shared/services/order-history.service';
import { ViewOrderDetailsComponent } from '../../modal/view-order-details/view-order-details.component';
import { ViewTransferHistoryDetailComponent } from '../../modal/transfer-history-details/transfer-history-details.component';
import { TransferType } from 'src/app/shared/_models/transferType';
import { TransferService } from '../../../shared/transfer.service';

@Component({
  selector: 'app-transfer-histories',
  templateUrl: './transfer-histories.component.html',
  styleUrls: ['./transfer-histories.component.scss']
})
export class TransferHistoriesComponent implements OnInit {  
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
  transferType = [
    { value: 'All', text: 'All' },
    { value: 'Self', text: 'Self' },
    { value: 'ForRep', text: 'For A Rep' }
  ];
  selectedType: any = this.transferType[0];

  validfilter = {
    month: false,
    customDate: false,
    typeSelected : false,
  }
  constructor(public mainService: MainService, public translate: TranslateService, public router: Router, public cartService: CartService,
    private fb: FormBuilder, private spinner: NgxSpinnerService, public modelService: NgbModal, private transferService: TransferService) {
  }

  ngOnInit(): void {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let endDate = new Date();

    this.filterForm = this.fb.group({
      month: ['3'],
      startDate: [(startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear()],
      endDate: [(endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear()],
      transferType: 'All',
      take: 3, 
      skip: 0, 
      page: 1
    });
    
    this.getAllTransferHistories({
      endDate: this.filterForm.value.endDate,
      startDate: this.filterForm.value.startDate
    }, this.pageRequest.page);
  }

  getAllTransferHistories(body: any, page: any): void {    
    this.spinner.show();
    
    const req:any = {};
    for (var p in body){
      switch(p){
        case 'month': //Filter out Select Date field in
        case 'selectDate': //Filter out Select Date field in
          break;
          case 'transferType':
            let tType = TransferType[body[p]];
            if(tType)
                req[p] = tType;
              else
                req[p] = null;
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
    
    this.transferService.geTransferHistories(req).subscribe((res: any) => {next: {
      this.orders = res.data.map((item: any) => { return { ...item } });
      this.totalItems = res.total;
      this.formatedCount = this.orders.length;
      this.loading = false;
      this.spinner.hide();
    }}, error => {
      this.spinner.hide();
    });
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
      body.startDate = (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear();
      body.endDate = (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear();

      this.filterForm?.patchValue({
        month: month,
        startDate: body.startDate,
        endDate: body.endDate,
        transferType: this.selectedType.value
      });
      if (parseInt(month) !== 3) {
        this.validfilter.month = true;
      }
    }
    
    let data = this.filterForm?.value
    this.getAllTransferHistories(data,this.pageRequest.page);
  }

  changeDate(ev: any): void {
    this.selectedDate = ev;
    if (ev && ev.startDate != null && ev.endDate != null) {
      this.mainService.triggerRemove.next(true);
      this.validfilter.customDate = true;
      
      let startDate:Date = ev.startDate.toDate();
      let endDate:Date = ev.endDate.toDate();

      //Fix for OPT-192 NaN appearing on Calendar days when user select Future Date.
      if (startDate > endDate) {
        endDate = startDate;
        this.selectedDate.endDate._d = endDate;
      }

      this.filterForm?.patchValue({
        month: '0',
        startDate: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
        endDate: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
        transferType: this.selectedType.value
      });
      this.getAllTransferHistories(this.filterForm?.value, this.pageRequest.page);
    }
  }

  public viewOrder(id: string, keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(ViewTransferHistoryDetailComponent, { windowClass: 'order-history-view', centered: true, keyboard, backdrop });
    modal.componentInstance.transferDetails = this.orders.find((item: any) => item.transferBatchId === id);

  }

  selectOrderType(oType: any) {
    this.selectedType = oType;
    if(oType.value != 'All')
    {
        this.validfilter.typeSelected = true;
    }
    this.filterhistory(this.month);
  }

  get haveFilter(): boolean {
    return this.validfilter.month || this.validfilter.customDate || this.validfilter.typeSelected;
  }

  get f(): any {
    return this.filterForm?.controls
  }

  initialFilter(): void {
    this.selectedType =this.transferType[0];
    this.validfilter = {
      month: false,
      customDate: false,
      typeSelected : false
}
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let endDate = new Date();

    this.filterForm?.patchValue({
      month: '3',
      startDate: (startDate.getMonth()+1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
      endDate: (endDate.getMonth()+1) + '-' + endDate.getDate() + '-' + endDate.getFullYear(),
      transferType: this.selectedType.value
    });
    this.getAllTransferHistories({
      endDate: this.filterForm?.value.endDate,
      startDate: this.filterForm?.value.startDate
    }, this.pageRequest.page);
  }
}
