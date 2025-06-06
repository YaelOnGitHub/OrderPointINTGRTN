import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/shared/cart.service';
import { MainService } from 'src/app/shared/services/main.service';
import { environment } from 'src/environments/environment';
import { ItemsService } from '../../../shared/items.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  themeVar = 'orange';
  baseApiEndPoint = environment.baseApiEndPoint;
  itemsMenus: [] = [];
  //isSalesRep: any;

  @Input() productDetails: any;
  @Input() orderType: any;
  @Input() repId: any;
  addToCartBTN: boolean = false;
  mod: any = {};
  clientId = '';
  prevImgEnlarged:boolean = false;
  prevImgZoomed:boolean = false;
  productModelHide: boolean = false;
  cartProductList: any = [];    
  columnDefs = [  
    { headerName: 'Activity Date', field: 'ActivityDateTime',suppressSizeToFit: true,width:100, sortable: true, valueFormatter: this.dateFormatter},  
    { headerName: 'Activity Description', field: 'ActivityDescription', sortable: true, cellStyle: {'white-space': 'normal'}, autoHeight: true }
  ];
  rowData : any = [];

  constructor(
    public modelService: NgbModal,
    private mainService:MainService,
     private itemService: ItemsService, 
     private cartService: CartService, 
     public modal: NgbActiveModal,
     private spinner: NgxSpinnerService,
     public translate: TranslateService) {

    // current theme check
    this.mainService.currentTheme.subscribe(res => {
      this.themeVar = res;
    });

    this.mainService.getCurrentUser().subscribe(currUser => {
      this.clientId = currUser ? currUser.homeClientId : '';
    });
    this.itemService.addToCartActiveOnProduct.subscribe(res => {
      this.addToCartBTN = res;
    });

    this.repId = sessionStorage.getItem('repIdSelected') ?? '';
    
  }

  ngOnInit(): void {

    //Commenting this logic beacuse it is not required anymore. As we are hiding available quanitiy of items from UI.  

    // this.mainService.getCurrentUser().subscribe(u => {          
    //   let rank = u.getHomeRole().rank;
    //   this.isSalesRep = rank == Role.SalesRep && (u.homeClientId == 'GSKUS' || u.homeClientId == 'GSKCA');
    //});
    //this.getItemDetail();
  }


  addTocart(item:any, itemID: any, quantity: number = 1) {
    const body = {
      orderType: this.orderType,
      item: {
        ...item,
        id: itemID,
        quantity: quantity
      },
      repId: this.repId
    }
    if (this.orderType !== '5') {
      delete body?.repId;
    }
    sessionStorage.setItem('orderTypeInCartSession', this.orderType ? this.orderType.toString() : '1');
    this.itemService.addCart(body);
    // this.itemService.addCart(body).subscribe(res => {
    //   // console.log(res);
    this.cartService.cartUpdate.next(true);
    this.itemService.productListUpdate.next(true);
    //   // this.modal.dismiss('loadList');
    // });
  }

  updateCart(item:any, itemID: any, ev: any, num = false) {
    const body = {
      ...item,
      id: itemID,
      quantity: !num ? ev.target.value : ev,
      repId: this.repId
    }
    if (this.orderType !== '5') {
      delete body?.repId;
    }
    this.productDetails.quantity = body.quantity;
    this.itemService.updateCart(body);

    if (!body.quantity) this.addToCartBTN = false; //Removed from cart
    // .subscribe(res => {
    //   // console.log(res);
      this.cartService.cartUpdate.next(true);
    this.itemService.productListUpdate.next(true);
    //   // this.modal.dismiss('loadList');
    // });
  }

  downloadFile(fileID: any): void {
    window.open(this.baseApiEndPoint + this.clientId + '/files/download/' + fileID);
  }

  noDownload(): void {
    this.productModelHide = true;
    const modal = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard: true, backdrop: true });
    modal.componentInstance.titleMain = "This product doesn't have the downloadable file.";
    modal.componentInstance.onlyOK = true;
    modal.result.then((userResponse) => {
      if (userResponse) {
        this.productModelHide = false;
      } else {
        this.productModelHide = true;
        this.modal.dismiss();
      }
    });
  }

  onCloseModal() {
    if (!this.prevImgEnlarged) {
      this.modal.dismiss();
    } else {
      this.prevImgEnlarged = false;
    }
  }

  onGridReady(params:any) {
    params.api.sizeColumnsToFit();
    this.getItemHistory();
  }

  getItemHistory() {

    var request = 
    {
      itemId : this.productDetails.id,
      emplSeqId : this.repId,
      orderType : this.orderType,
      languageCode : this.translate.currentLang === "en" ? "en-us" : "fr-ca"    
    };
    this.spinner.show();
    this.itemService.getItemHistory(request).subscribe(res => {  
      this.rowData = res;
      this.spinner.hide();
    }, error => {
      this.rowData = [];
      this.spinner.hide();
    });
  }

  dateFormatter(param : any) {
    let date = new Date(param.value);
    return date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate() + ', ' + date.getFullYear();
  }
  

}
