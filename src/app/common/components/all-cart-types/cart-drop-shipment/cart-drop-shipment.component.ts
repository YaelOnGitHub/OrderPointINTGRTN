import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddAddressComponent } from 'src/app/common/modal/add-address/add-address.component';
import { CancelOrderComponent } from 'src/app/common/modal/cancel-order/cancel-order.component';
import { ConfirmationComponent } from 'src/app/common/modal/confirmation/confirmation.component';
import { ConfirmedOrderComponent } from 'src/app/common/modal/confirmed-order/confirmed-order.component';
import { ProductDetailsComponent } from 'src/app/common/modal/product-details/product-details.component';
import { RemoveFromCartComponent } from 'src/app/common/modal/remove-from-cart/remove-from-cart.component';
import { CartService } from 'src/app/shared/cart.service';
import { ItemsService } from 'src/app/shared/items.service';
import { MainService } from 'src/app/shared/services/main.service';
import { CartRequest, ItemRequest } from 'src/app/shared/_models/cartmodel';
import { UserControlService } from 'src/app/users/service/user-control.service';
declare var $: any;

@Component({
  selector: 'app-cart-drop-shipment',
  templateUrl: './cart-drop-shipment.component.html',
  styleUrls: ['./cart-drop-shipment.component.scss']
})
export class CartDropShipmentComponent implements OnInit {
  itemsMenus: [] = [];
  cartId: any;
  public searchSelector: string = "";
  address: any;
  selected = -1;
  totalItems: any = 0;
  mod: any = {};
  title: string = ""
  repId:string  = '';
  cartProductList: any = [];
  cid:string = '';
  serviceRequestId:string = '';
  isSsoVaccineRep: boolean = false;

  constructor(
    private spinner: NgxSpinnerService, 
    private _mainService: MainService, 
    private itemService: ItemsService,
     private _cartService: CartService, 
     public translate:TranslateService,
     public modelService: NgbModal, 
     public userControl: UserControlService) {

    // this.userControl.sidebarFilterControl.subscribe(data => {
    //   this.mod.OrderType = data.orderType;
    //   this.repId = data.repId;
    // });

    let repId = sessionStorage.getItem('repIdSelected') as string;
    this.repId = repId ? repId : '';

    let orderId = sessionStorage.getItem('orderTypeInCartSession') as string;
    this.mod.OrderType = orderId ? orderId : '';

    this._mainService.languageChange.subscribe(lang => {
      if (this.mod.OrderType == "3")
        this.title = lang === 'en' ? "Drop-Shipment Retail" : 'Vente au détail en livraison directe'
      else
        this.title = lang === 'en' ? "Drop-Shipment Vaccine" : 'Vaccin de livraison directe'
    });
  }

  ngOnInit(): void {
    this.getChartItems();

    //Get External Data (if applicable)
    this._mainService.getExternalData().subscribe(extData => {
      if (extData?.fromGskGrc == false){
        this.isSsoVaccineRep = true;
        this.mod.recipientFirstName = extData.firstName;
        this.mod.recipientLastName = extData.lastName;
        this.address = {
          address1:extData.address1,
          address2:extData.address2,
          city: extData.city,
          state: extData.state,
          zip: extData.zipCode,
          country: 'US' //Always use US
        };
        this.cid = extData.cid;
        this.serviceRequestId = extData.serviceRequestId;
      }
    });
  }
  changeShippingPriority(ev: any): any { 
    sessionStorage.setItem('dropShipmentPriority', this.mod.shippingPriority);
  }
  changeName():any{
    sessionStorage.setItem('dropShipmentRecipientFirstName', this.mod.recipientFirstName);
    sessionStorage.setItem('dropShipmentRecipientLastName', this.mod.recipientLastName);
  }

  getChartItems() {
    let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any);
    let orderType = sessionStorage.getItem('orderTypeInCartSession') as any;
    let shippingPriority = sessionStorage.getItem('dropShipmentPriority') as any;
    let recipientFirstName = sessionStorage.getItem('dropShipmentRecipientFirstName') as any || '';
    let recipientLastName = sessionStorage.getItem('dropShipmentRecipientLastName') as any || '';

    this.address = JSON.parse(sessionStorage.getItem('dropShipmentAddress') as any);

    this.cartProductList = items ? items : [];
    this.mod = {};
    this.mod.OrderType = orderType;
    this.mod.items = this.cartProductList.map((item: any) => { return { ...item } });
    this.mod.shippingPriority = shippingPriority || 1; // DEFAULT SHIIPPING TYPE NORMAL
    this.mod.recipientFirstName = recipientFirstName;
    this.mod.recipientLastName = recipientLastName;
    this.totalItems = this.mod.items.length;
    // });
  }

  public editAddress(keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(AddAddressComponent, { windowClass: 'address-view', centered: true, keyboard, backdrop });
    modal.componentInstance.address = Object.assign({}, this.address); //Deep copy address to modal
    modal.result.then((userResponse) => {
      if (userResponse) {
        this.address = userResponse;

        //Save in session
        sessionStorage.setItem('dropShipmentAddress', JSON.stringify(this.address));
        this.getChartItems();
      }
    }, (reason) => {});
  }

  public removeFromCart(item: any, keyboard = true, backdrop: boolean | 'static' = true) {
    const modalRef = this.modelService.open(RemoveFromCartComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
    modalRef.result.then((userResponse) => {
      if (userResponse) {
        const index: number = this.mod.items.indexOf(item);
        if (index !== -1) {
          // this._cartService.removeItem(this.cartId, item.id).subscribe(res => {
          this.mod.items.splice(index, 1);
          this.cartProductList.splice(index, 1);
          this.totalItems = this.mod.items.length;
          sessionStorage.setItem('productExistInCartSession', JSON.stringify(this.cartProductList));
          if(this.totalItems == 0)
          {
            this.clearSessionState();
          }
          this._cartService.cartUpdate.next(true);
          // });
        }
        //this.getChartItems();
      }
    });
  }

  public submitOrder(form:FormGroup, keyboard = true, backdrop: boolean | 'static' = true) {
    //Validate
    form.markAllAsTouched();
    if (!form.valid) return;

    this._mainService.getCurrentUser().subscribe(currUser => {
      //If the user is impersonating, do not allow them to place the order
      if (currUser.impersonator != ''){        
        this.translate.get("cartPages.dropShipment.errors.impersonator").subscribe(msg => {
          const addressMissingRef = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
          addressMissingRef.componentInstance.titleMain = msg;
          addressMissingRef.componentInstance.onlyOK = true;
          addressMissingRef.result.then((userResponse) => {});
        });
      } else {
        //Otherwise order is allowed
        if(!this.address){
          this.translate.get("cartPages.dropShipment.errors.addressRequired").subscribe(msg => {
            const addressMissingRef = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
            addressMissingRef.componentInstance.titleMain = msg;
            addressMissingRef.componentInstance.onlyOK = true;
            addressMissingRef.result.then((userResponse) => {});
          });
          return;
        }

        const modalRef = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
        modalRef.componentInstance.orderType = this.mod.orderType;
        modalRef.componentInstance.titleMain = null;
        modalRef.result.then((userResponse) => {
          if (userResponse) {    
            this.spinner.show();    
            this.address.firstName = this.mod.recipientFirstName;
            this.address.lastName = this.mod.recipientLastName;
            let req: CartRequest =
            {
              orderType: this.mod.OrderType,
              shippingPriority: this.mod.shippingPriority,
              items: this.mod.items,
              shipToAddress: this.address,
              recipientFirstName: this.mod.recipientFirstName,
              recipientLastName: this.mod.recipientLastName,
              deliveryInstructions: this.mod.deliveryInstructions,
              cid: this.cid,
              serviceRequestId:this.serviceRequestId
            };

            this._cartService.submitOrder(req).subscribe(res => {
              this.spinner.hide();

              if (res !== "") {
                const modal = this.modelService.open(ConfirmedOrderComponent, { windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
                modal.componentInstance.orderNumber = res;
                this.clearSessionState();
        
                // sessionStorage.removeItem('orderTypeInCartSession');
                this._cartService.cartUpdate.next(true);
              }
            }, (error: any) => {
              let errorCodeTranslated = 'submitError';
              let productId = '';
              // Handle the 400 Bad Request error response
              if (error && error.error && error.error.Message) 
              {
                try 
                {
                  const errorResponse = JSON.parse(error.error.Message);          
                  if (errorResponse) {
                    const errorCode = errorResponse.OrderSubmissionErrorCode;
                    if (errorCode) {
                      errorCodeTranslated = errorCode;
                      productId = errorResponse.ErrorMessage;
                    }
                  }
                } 
                catch (parseError) 
                {
                  
                }
              }
              // Handle generic error here
              this.displayGenericErrorMessage(errorCodeTranslated, productId);
            });
          }
        });
      }
    });
  }
  /**
   * Clears the cart data from the session state
   */
  clearSessionState():void{
    sessionStorage.removeItem('productExistInCartSession');
    sessionStorage.removeItem('repIdSelected');
    sessionStorage.removeItem('dropShipmentPriority');
    sessionStorage.removeItem('dropShipmentRecipientFirstName');
    sessionStorage.removeItem('dropShipmentRecipientLastName');
    sessionStorage.removeItem('dropShipmentAddress');
  }

  updateCart(itemNAME: any, itemID: any, ev: any, num = false) {
    const body: any = {
      ...itemNAME,
      id: itemID,
      quantity: !num ? ev.target.value : ev,
      repId: this.mod.orderedById
    }
    if (this.mod.orderType !== 5) {
      delete body.orderedById;
    }
    // console.log(JSON.stringify(body))
    this.itemService.updateCart(body);
    this._cartService.cartUpdate.next(true);
    this.getChartItems();
  }


  public cancelOrder(keyboard = true, backdrop: boolean | 'static' = true) {
    const modalRef = this.modelService.open(CancelOrderComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
    modalRef.result.then((userResponse) => {
      if (userResponse) {
        this.clearSessionState();
        this.mod.items.splice(0, this.totalItems);
        this.totalItems = 0;
        this._cartService.cartUpdate.next(true);
      }
    });
  }

  public productDetails(item: any, keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(ProductDetailsComponent, { windowClass: 'filter-view', centered: true, keyboard, backdrop });
    modal.componentInstance.productDetails = item;
    this.itemService.addToCartActiveOnProduct.next(true);
  }
  
  displayGenericErrorMessage(errorCode: string, productId: string) {
    if (!errorCode || errorCode.trim() === "") {
      // Handle the case where errorCode is null or empty
      errorCode = 'submitError';
    }
    const addressMissingRef = this.modelService.open(ConfirmationComponent,{ windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
    addressMissingRef.componentInstance.onlyOK = true;
    const errorMessageKey = `cartPages.dropShipment.errors.${errorCode}`;
  
    this.translate.get(errorMessageKey).subscribe(msg => {      
      let errorMessage = '';
      errorMessage = msg;
      if(errorMessage.indexOf('###productid###') > 0)
      {
        errorMessage = errorMessage.replace('###productid###', productId);
      }
      addressMissingRef.componentInstance.titleMain = errorMessage;
      this.spinner.hide();
  });
  }
}
