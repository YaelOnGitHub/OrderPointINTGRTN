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
import { AddressService } from 'src/app/shared/address.service';
import { CartService } from 'src/app/shared/cart.service';
import { ItemsService } from 'src/app/shared/items.service';
import { MainService } from 'src/app/shared/services/main.service';
import { ToasterService } from 'src/app/shared/toaster.service';
import { CartRequest } from 'src/app/shared/_models/cartmodel';
import { UserControlService } from 'src/app/users/service/user-control.service';

declare var $: any;

@Component({
  selector: 'app-cart-convention-shipment',
  templateUrl: './cart-convention-shipment.component.html',
  styleUrls: ['./cart-convention-shipment.component.scss']
})
export class CartConventionShipmentComponent implements OnInit {
  itemsMenus: [] = [];
  cartId: any;
  public searchSelector: string = "";
  addresses: any = [];
  address: any;
  selected = -1;
  totalItems: any = 0;
  mod: any = {};
  repId = '';
  currUserName:string = ''
  cartProductList: any = [];

  constructor(private spinner: NgxSpinnerService, 
    private _mainService: MainService, 
    private itemService: ItemsService, 
    private _cartService: CartService, 
    private _toast: ToasterService,
    public translate:TranslateService,
    public modelService: NgbModal, 
    public userControl: UserControlService, 
    public addressService: AddressService) {
    // this.userControl.sidebarFilterControl.subscribe(data => {
    //   this.mod.OrderType = data.orderType;
    //   this.repId = data.repId
    // });
    let repId = sessionStorage.getItem('repIdSelected') as string;
    this.repId = repId ? repId : '';

    let orderId = sessionStorage.getItem('orderTypeInCartSession') as string;
    this.mod.OrderType = orderId ? orderId : '';
  }

  ngOnInit(): void {
    this._cartService.getAddress(this.repId).subscribe(res => {
      this.addresses = res;
      //Set default address based on currently choosen preferred address
      let preferred = this.addresses.filter((a:any) => {return a.isPreferredAddress;});
      if(preferred.length) this.mod.selectedAddressId = preferred[0].id;
    });
    this._mainService.getCurrentUser().subscribe(currUser => {
      this.currUserName = currUser.getFullName();
    });
    // // console.log('cart-cart-convention-shipment');
    // this._cartService.getCARTDetailsFull().subscribe(data => {
    //   // console.log(data);
    //   if (data !== '0') {
    //     this.cartId = data;
    this.getChartItems();
    //   }
    // });
  }
  
  public editAddress(keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(AddAddressComponent, { windowClass: 'address-view', centered: true, keyboard, backdrop });
    modal.componentInstance.address = Object.assign({}, this.address); //Deep copy address to modal
    modal.result.then((userResponse) => {
      if (userResponse) {
        this.address = userResponse;

        //Save in session
        sessionStorage.setItem('conventionShipmentAddress', JSON.stringify(this.address));
        this.getChartItems();
      }
    }, (reason) => {});
  }

  changeAddressType(ev: any): any { 
    sessionStorage.setItem('conventionShipmentAddressType', this.mod.addressType);
  }
  changeShippingPriority(ev: any): any { 
    sessionStorage.setItem('conventionShipmentPriority', this.mod.shippingPriority);
  }

  getChartItems() {
    let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any);
    let orderType = sessionStorage.getItem('orderTypeInCartSession') as any;
    let shippingPriority = sessionStorage.getItem('conventionShipmentPriority') as any;
    let addressType = sessionStorage.getItem('conventionShipmentAddressType') as any;
    
    this.address = JSON.parse(sessionStorage.getItem('conventionShipmentAddress') as any);

    this.cartProductList = items ? items : [];

    this.mod = {};
    this.mod.OrderType = orderType;
    this.mod.items = this.cartProductList.map((item: any) => { return { ...item } });
    this.mod.shippingPriority = shippingPriority || 1; // DEFAULT SHIIPPING TYPE NORMAL
    this.mod.addressType = addressType || '1'; //DEFAULT TO SELF

    let address: any = this.addresses.find(function (record: any) {
      return record.isPreferredAddress;
    });
    this.totalItems = this.mod.items.length;
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
        this.translate.get("cartPages.conventionShipment.errors.impersonator").subscribe(msg => {
          const addressMissingRef = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
          addressMissingRef.componentInstance.titleMain = msg;
          addressMissingRef.componentInstance.onlyOK = true;
          addressMissingRef.result.then((userResponse) => {});
        });
      } else {
        //Otherwise order is allowed
        const selectedAddress = this.addresses.filter((address:any) => address.id == this.mod.selectedAddressId)[0];
        const address = this.mod.addressType == 1 ? selectedAddress : this.address;
        if(!address){
          this.translate.get("cartPages.conventionShipment.errors.addressRequired").subscribe(msg => {
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
            let req: CartRequest =
            {
              orderType: this.mod.OrderType,
              shippingPriority: this.mod.shippingPriority,
              items: this.mod.items,
              deliveryInstructions: this.mod.deliveryInstructions,
              shipToAddress: address,
              shipToAddressId: this.mod.addressType == 1 ? this.mod.selectedAddressId : null
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
    sessionStorage.removeItem('conventionShipmentPriority');
    sessionStorage.removeItem('conventionShipmentAddressType');
    sessionStorage.removeItem('conventionShipmentAddress');
  }

  updateCart(itemID: any, ev: any, num = false) {
    const body: any = {
      id: itemID,
      quantity: !num ? ev.target.value : ev,
      repId: this.mod.orderedById
    }
    if (this.mod.orderType !== 5) {
      delete body.orderedById;
    }
    this.itemService.updateCart(body);
    this._cartService.cartUpdate.next(true);
    this.getChartItems();
  }
 
  public selectPreferred(event: any, itemIndex: number): void {
    this.addresses.forEach((element: any) => {
      element.isPreferredAddress = false;
    });
    this.addresses[itemIndex].isPreferredAddress = event.target.checked;
    this._cartService.updateAddress(this.addresses[itemIndex], this.repId).subscribe((res) => {   
      if (res){
        this.translate.get('cartPages.conventionShipment.preferredAddressUpdated').subscribe((msg) => {
          this._toast.showSuccess(msg.message, msg.status);
        });
      } else {
        this.translate.get('cartPages.conventionShipment.preferredAddressUpdateFailed').subscribe((msg) => {
          this._toast.showError(msg.message, msg.status);
        });
      }
    }); //Post change to server
  }


  public cancelOrder(keyboard = true, backdrop: boolean | 'static' = true) {
    const modalRef = this.modelService.open(CancelOrderComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
    modalRef.result.then((userResponse) => {
      if (userResponse) {
        // this._cartService.cancelCart(this.cartId).subscribe(res => {
        this.clearSessionState();
        this.mod.items.splice(0, this.totalItems);
        this.totalItems = 0;
        this._cartService.cartUpdate.next(true);

        // });
      }
    });
  }

  public confirmedOrder(keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(ConfirmedOrderComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
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
    const errorMessageKey = `cartPages.conventionShipment.errors.${errorCode}`;
  
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
