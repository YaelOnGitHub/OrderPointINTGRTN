import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CancelOrderComponent } from 'src/app/common/modal/cancel-order/cancel-order.component';
import { ConfirmationComponent } from 'src/app/common/modal/confirmation/confirmation.component';
import { ConfirmedOrderComponent } from 'src/app/common/modal/confirmed-order/confirmed-order.component';
import { ProductDetailsComponent } from 'src/app/common/modal/product-details/product-details.component';
import { ProductNotAvailableComponent } from 'src/app/common/modal/product-not-available/product-not-available.component';
import { RemoveFromCartComponent } from 'src/app/common/modal/remove-from-cart/remove-from-cart.component';
import { CartService } from 'src/app/shared/cart.service';
import { ItemsService } from 'src/app/shared/items.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { MainService } from 'src/app/shared/services/main.service';
import { ToasterService } from 'src/app/shared/toaster.service';
import { CartRequest, ItemRequest } from 'src/app/shared/_models/cartmodel';
import { UserControlService } from 'src/app/users/service/user-control.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  itemsMenus: [] = [];
  orderType = '';
  repId = '';
  terrId = '';
  cartId: any;
  public searchSelector: string = "";
  addresses: any = [];
  selected = -1;
  totalItems: any = 0;
  mod: any = {};
  cartProductList: any = [];  
  clientId = '';

  constructor(
    private spinner: NgxSpinnerService,
    public adminService: AdminService,
    private _mainService: MainService,
    private _itemService: ItemsService,
    private _cartService: CartService,
    private _toast: ToasterService,
    public translate: TranslateService,
    public modelService: NgbModal,
    public userControl: UserControlService) {

    let repId = sessionStorage.getItem('repIdSelected') as string;
    this.repId = repId ? repId : '';

    let terrId = sessionStorage.getItem('terIdSelected') as string;
    this.terrId = terrId ? terrId : '';
  }

  ngOnInit(): void {
    this._cartService.getAddress(this.repId).subscribe(res => {
      this.addresses = res;
      //Set default address based on currently choosen preferred address
      let preferred = this.addresses.filter((a: any) => { return a.isPreferredAddress; });
      if (preferred.length) this.mod.selectedAddressId = preferred[0].id;
    });
    this.getChartItems();
  }

  changeShippingPriority(ev: any): any {
    sessionStorage.setItem('selfOrderPriority', this.mod.shippingPriority);
  }

  getChartItems() {
    let items = JSON.parse(sessionStorage.getItem('productExistInCartSession') as any);
    let orderType = sessionStorage.getItem('orderTypeInCartSession') as any;
    let shippingPriority = sessionStorage.getItem('selfOrderPriority') as any;
    this.cartProductList = items ? items : [];
    // this.mod = {};
    this.mod.OrderType = orderType;
    this.mod.items = this.cartProductList.map((item: any) => { return { ...item, addedToCart: true } });
    this.mod.shippingPriority = shippingPriority || 1; // DEFAULT SHIIPPING TYPE NORMAL
    let sum = 0;
    for (let index = 0; index < this.cartProductList.length; index++) {
      sum += this.cartProductList[index].quantity;
    }
    this.totalItems = sum;
    // this.addresses = [];
    // });
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
          if (this.totalItems == 0) {
            this.clearSessionState();
          }
          this._cartService.cartUpdate.next(true);
          // });
        }
        //this.getChartItems();
      }
    });
  }

  isCartWarningVisible(): boolean {
    if (this.clientId?.trim()) {
      return this.clientId === 'AXSOM';
    }
  
    // Fetch and update clientId if not already set
    this._mainService.getCurrentUser().subscribe(currUser => {
      this.clientId = currUser?.homeClientId || '';
      return this.clientId === 'AXSOM';
    });
  
    return false; // Default to false until clientId is updated
  }

  public submitOrder(form: FormGroup, keyboard = true, backdrop: boolean | 'static' = true) {
    //Validate
    form.markAllAsTouched();
    if (!form.valid) return;

    this._mainService.getCurrentUser().subscribe(currUser => {
      if (currUser.impersonator != '') {
        //If the user is impersonating, do not allow them to place the order
        this.translate.get("cartPages.selfOrder.errors.impersonator").subscribe(msg => {
          const addressMissingRef = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
          addressMissingRef.componentInstance.titleMain = msg;
          addressMissingRef.componentInstance.onlyOK = true;
          addressMissingRef.result.then((userResponse) => { });
        });
      } else {
        //Otherwise order is allowed
        const selectedAddress = this.addresses.filter((address: any) => address.id == this.mod.selectedAddressId)[0];
        if (!selectedAddress) {
          this.translate.get("cartPages.selfOrder.errors.addressRequired").subscribe(msg => {
            const addressMissingRef = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
            addressMissingRef.componentInstance.titleMain = msg;
            addressMissingRef.componentInstance.onlyOK = true;
            addressMissingRef.result.then((userResponse) => { });
          });
          return;
        }

        const modalRef = this.modelService.open(ConfirmationComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
        modalRef.componentInstance.orderType = this.mod.orderType;
        modalRef.componentInstance.titleMain = null;
        modalRef.result.then((userResponse) => {

          if (userResponse) {
            this.spinner.show();

            let repId = sessionStorage.getItem('repIdSelected')

            //Temporary Fix for fixation of Self order 
            if (!this.mod.OrderType)
              this.mod.OrderType = "1";

            let req: CartRequest =
            {
              orderType: this.mod.OrderType,
              shippingPriority: this.mod.shippingPriority,
              items: this.mod.items,
              shipToAddressId: this.mod.selectedAddressId,
              shipToAddress: selectedAddress,
              orderedForRepId: this.mod.OrderType == 5 ? this.repId : null,
              orderedForTerritoryId: this.mod.OrderType == 5 ? this.terrId : null
            };

            this.clientId = currUser ? currUser.homeClientId : '';
            if (this.clientId === 'SUPER' && this.checkForRxItems()) {              
              // Enforce address selection for SUPER only
              if(!this.enforceFedExAddressSelection(selectedAddress)){
                  this.spinner.hide();
                  return;
                }
            }
            
            this._cartService.submitOrder(req).subscribe(res => {
              if (res !== "") {
                  
                this.spinner.hide();

                const modal = this.modelService.open(ConfirmedOrderComponent, { windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
                modal.componentInstance.orderNumber = res;
                this.clearSessionState();
                // sessionStorage.removeItem('orderTypeInCartSession');
                this._cartService.cartUpdate.next(true);                
              }
            },(error: any) => {
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

  enforceFedExAddressSelection(selectedAddress: any): boolean {
    
    // Check if address1 property of selectedAddress is null or undefined
    const userSelectedAddressContains = selectedAddress.address1 && 
       (selectedAddress.address1.toLowerCase().includes('fedex') || 
        selectedAddress.address1.toLowerCase().includes('walgreens'));
 
    // Check if isFedExOrWalgreensAddressExists is true (a FedEx or Walgreens address exists in this.addresses)
    const isFedExOrWalgreensAddressExists = Boolean(this.addresses.find((address: any) => 
        (address.address1 && address.address1.toLowerCase().includes('fedex')) || 
        (address.address1 && address.address1.toLowerCase().includes('walgreens'))));
 
    if (isFedExOrWalgreensAddressExists && userSelectedAddressContains) {
        return true;
    }
 
    // Check if preferredAddress is true
    const preferredAddress = selectedAddress.isPreferredAddress;
    if (!isFedExOrWalgreensAddressExists && preferredAddress) {
        return true;
    }
 
     this.displayAddressRequiredMessage();
     return false;
 }
 

private checkForRxItems(): boolean {
  return this.mod.items.some((item: any) => item.type && item.type.toLowerCase() === 'rx');
}

private displayAddressRequiredMessage(): void {
    this.translate.get('cartPages.fedExWarningMessage').subscribe(msg => {
        const addressMissingRef = this.modelService.open(ConfirmationComponent, {  windowClass: 'fedex-address-warning', centered: true, keyboard:false, backdrop: 'static'});
        addressMissingRef.componentInstance.titleMain = msg;
        addressMissingRef.componentInstance.onlyOK = true;
        addressMissingRef.result.then((userResponse) => {});
    });
}

  displayGenericErrorMessage(errorCode: string, productId: string) {
    if (!errorCode || errorCode.trim() === "") {
      // Handle the case where errorCode is null or empty
      errorCode = 'submitError';
    }
    const addressMissingRef = this.modelService.open(ConfirmationComponent,{ windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
    addressMissingRef.componentInstance.onlyOK = true;
    const errorMessageKey = `cartPages.selfOrder.errors.${errorCode}`;
  
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

  /**
   * Clears the cart data from the session state
   */
  clearSessionState(): void {
    sessionStorage.removeItem('productExistInCartSession');
    sessionStorage.removeItem('repIdSelected');
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
    // // console.log(JSON.stringify(body))
    this._itemService.updateCart(body);
    // this._cartService.updateQuantity(this.cartId, body)
    // .subscribe(res => {
    //   // console.log(res);
    this._cartService.cartUpdate.next(true);
    this.getChartItems();
    // });
  }

  public selectPreferred(event: any, itemIndex: number): void {
    this.addresses.forEach((element: any) => {
      element.isPreferredAddress = false;
    });
    this.addresses[itemIndex].isPreferredAddress = event.target.checked;
    this._cartService.updateAddress(this.addresses[itemIndex], this.repId).subscribe((res) => {
      if (res) {
        this.translate.get('cartPages.selfOrder.preferredAddressUpdated').subscribe((msg) => {
          this._toast.showSuccess(msg.message, msg.status);
        });
      } else {
        this.translate.get('cartPages.selfOrder.preferredAddressUpdateFailed').subscribe((msg) => {
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
    item.addedToCart = true;
    modal.componentInstance.productDetails = item;
    this._itemService.addToCartActiveOnProduct.next(true);
  }

  public productNotAvailable(item: any = null, keyboard = true, backdrop: boolean | 'static' = true) {
    const modal = this.modelService.open(ProductNotAvailableComponent, { windowClass: 'filter-view', centered: true, keyboard, backdrop });
  }

}
