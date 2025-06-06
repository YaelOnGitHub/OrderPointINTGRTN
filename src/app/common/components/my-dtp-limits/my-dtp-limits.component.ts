import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartService } from 'src/app/shared/cart.service';
import { MainService } from 'src/app/shared/services/main.service';
import { OrderHistoryService } from 'src/app/shared/services/order-history.service';
import { IDropdownSettings  } from 'ng-multiselect-dropdown';
import { TransferService } from 'src/app/shared/transfer.service';
import { TransferType } from 'src/app/shared/_models/transferType';
import { TransferRequest, TransferProductRequest } from 'src/app/shared/_models/transferRequest';
import { ConfirmedOrderComponent } from 'src/app/common/modal/confirmed-order/confirmed-order.component';
import { ConfirmationTransferComponent } from 'src/app/common/modal/confirmation-transfer/confirmation-transfer.component';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-my-dtp-limits',
  templateUrl: './my-dtp-limits.component.html',
  styleUrls: ['./my-dtp-limits.component.scss']
})
export class MyDtpLimitsComponent implements OnInit  {  

  itemsMenus: [] = [];
  transferType = [
    { value: TransferType.Self, text: 'Self' },
    { value: TransferType.ForRep, text: 'For A Rep' }
  ];
    selectedTransferType: TransferType | undefined;
    filterForm?: FormGroup;
    isRepDisabled: boolean = true;
    isDisabled : boolean = true;

    saleRepList: any[] = [];
    products: any[] = [];

    selectedSaleRep : any[] = [];
    selectedProducts : any[] = [];

    saleRepDropdownSettings : IDropdownSettings = {};
    productDropdownSettings : IDropdownSettings = {};

    enabledTransferTypeDropdown = true;

    disabledSaleRepDropdown = true;
    disabledProductsDropdown = true;

    showWarning = false;
    isImpersonateActive= false;

    fetchProductRequest: any = {
      transferType: null,
      repTo:  ''
    }

    selectedTransferProducts : any[] = [];

  constructor(
    public mainService: MainService, 
    public translate: TranslateService, 
    public router: Router, 
    public cartService: CartService,
    public transferService: TransferService, 
    private spinner: NgxSpinnerService, 
    public as: AdminService,
    public modelService: NgbModal) {
      this.as.impersonateUserActive.subscribe((res: any) => {
        this.isImpersonateActive = res;
      });
  }

  

  
  ngOnInit(): void {    
    this.applyDefaultDropdownSettings();
    this.getEligiblityStatus();
  }

  defaultPageSetting() {
    this.enabledTransferTypeDropdown = true;
    this.disabledSaleRepDropdown = true;
    this.disabledProductsDropdown = true; 
    this.selectedTransferType= undefined;
    this.saleRepList = [];
    this.products = [];
    this.selectedSaleRep = [];
    this.selectedProducts = [];
    this.selectedTransferProducts = [];
    this.applyDefaultDropdownSettings();
    this.getEligiblityStatus();
  }

  getEligiblityStatus(){
    this.spinner.show();
    this.transferService.getTransferEligiblity().subscribe(res => {  
      this.enabledTransferTypeDropdown = res.AllowTransfer;
      if(!this.enabledTransferTypeDropdown)
        this.showWarning = true;
      this.spinner.hide();
    }, error => {      
      this.enabledTransferTypeDropdown = false;
      this.showWarning = true;
      this.spinner.hide();
    });
  }
  getSaleRep() {
    this.spinner.show();
    this.transferService.getSaleReps().subscribe(res => {  
      this.disabledSaleRepDropdown = false;
      this.saleRepList = res;
      this.spinner.hide();
    }, error => {      
      this.disabledSaleRepDropdown = true;
      this.spinner.hide();
    });
  }

  getProducts() {
    this.selectedProducts = [];
    this.selectedTransferProducts = [];
    this.products = []; 
    this.fetchProductRequest.transferType = this.selectedTransferType;
    this.fetchProductRequest.repTo = this.selectedSaleRep[0]?.id ?? '';
    this.spinner.show();
    this.transferService.getProductsWithDTPInfomation(this.fetchProductRequest).subscribe(res => {  
      this.disabledProductsDropdown = false;
      this.products = res;
      this.spinner.hide();
    }, error => {      
      this.disabledProductsDropdown = true;
      this.spinner.hide();
    });
  }

resetTransfer(){  // Navigates back to the current route
    this.defaultPageSetting();
  }

 remove(item: any) {
   // Remove item from selectedTransferProducts
  const updatedTransferProducts = this.selectedTransferProducts.filter(product => product.id !== item.id);

  // Remove item from selectedProducts
  const updatedSelectedProducts = this.selectedProducts.filter(product => product.id !== item.id);

  // Assign the updated arrays to trigger change detection
  this.selectedTransferProducts = updatedTransferProducts;
  this.selectedProducts = updatedSelectedProducts;

  }

  onKeyPress(event: KeyboardEvent): void {
    // Allow only numeric characters (0-9) and the Backspace key (keyCode 8)
    const allowedKeys = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace' ];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onInput(item: any): void {
    // Ensure that selectedQuantity is within the range of max_quantity
    if (item.selectedQuantity > item.max_quantity) {
      item.selectedQuantity = item.max_quantity;
    } else if (item.selectedQuantity < 1) {
      item.selectedQuantity = 1;
    }
  }

  onBlur(item: any): void {
    // Ensure that selectedQuantity is within the range of max_quantity when the input loses focus
    if (item.selectedQuantity > item.max_quantity) {
      item.selectedQuantity = item.max_quantity;
    } else if (item.selectedQuantity < 1) {
      item.selectedQuantity = 1;
    }
  }

increment(item: any) {
  const product = this.selectedTransferProducts.find(p => p.id === item.id);
  if (product) {
    if (product.selectedQuantity < product.max_quantity) {
      product.selectedQuantity++;
    }
    if (product.selectedQuantity > product.max_quantity) {
      product.selectedQuantity = product.max_quantity;
    }
  }
}

decrement(item: any) {
  const product = this.selectedTransferProducts.find(p => p.id === item.id);
  if (product) {
    if (product.selectedQuantity > 1) {
      product.selectedQuantity--;
    }
    if (product.selectedQuantity > product.max_quantity) {
      product.selectedQuantity = product.max_quantity;
    }
  }
}

onProductSelect(item: any) {
  const selectedProduct = this.products.find(product => product.id === item.id);
  if (selectedProduct) {
    if (!this.selectedTransferProducts.includes(selectedProduct)) {
      selectedProduct.selectedQuantity = 1;
      this.selectedTransferProducts.push(selectedProduct);
    }
  }
}

onProductDeSelect(item: any) {
  const deselectedProduct = this.products.find(product => product.id === item.id);
  if (deselectedProduct) {
    const index = this.selectedTransferProducts.indexOf(deselectedProduct);
    if (index !== -1) {
      this.selectedTransferProducts.splice(index, 1);
    }
  }
}


changeTransferType() {
    this.selectedProducts = [];
    this.selectedTransferProducts = [];
    this.products = []; 
    this.selectedSaleRep = [];
    this.saleRepList = [];
    if (this.selectedTransferType ==  TransferType.ForRep) {
        this.getSaleRep();
        this.disabledProductsDropdown = true;
    } else {
        this.getProducts();
        this.disabledSaleRepDropdown = true;
        this.disabledProductsDropdown = true;
    }
  }

onItemSelect(item: any) {
    if (this.selectedTransferType ==  TransferType.ForRep && this.selectedSaleRep != null)  
      this.getProducts();
    else  
      this.disabledProductsDropdown = false; 
  }

   
applyDefaultDropdownSettings() {

    this.saleRepDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.productDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      enableCheckAll : false
    };

  } 
  
  public async submitOrder(form: FormGroup, keyboard = true, backdrop: boolean | 'static' = true) {
    //Validate
    form.markAllAsTouched();
    if (!form.valid) return;
 
     if (this.selectedTransferProducts.length <= 0) {
       this.translate.get("transferPage.submitTransfer.noproductselected").subscribe(msg => {
         const productMissingRef = this.modelService.open(ConfirmationTransferComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
         productMissingRef.componentInstance.title = msg;
         productMissingRef.componentInstance.onlyOK = true;
         productMissingRef.result.then((userResponse) => { });
       });
       return;
     }
                 
      if (this.isImpersonateActive) {
        this.translate.get("transferPage.apiMessageCode.SERVER_ERROR_SUBMISSION_NOT_ALLOWED_WHILE_IMPERSONATION").subscribe(msg => {
          const productMissingRef = this.modelService.open(ConfirmationTransferComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
          productMissingRef.componentInstance.title = `${msg}` ;
          productMissingRef.componentInstance.onlyOK = true;
          productMissingRef.result.then((userResponse) => { });
        });
        return;
      }

     this.translate.get("transferPage.submitTransfer.title").subscribe(msg => {
        const modalRef = this.modelService.open(ConfirmationTransferComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });        
        modalRef.componentInstance.title = msg;
        modalRef.result.then((userResponse) => {

          if (userResponse) {
            this.spinner.show();
 
            const transferProductRequest: TransferProductRequest[] = [];

            let proceedSubmit:Boolean = true;  

          if (proceedSubmit)
          {
            this.selectedTransferProducts.forEach((product) => {
                if (product.selectedQuantity <= product.max_quantity) {
                    transferProductRequest.push({
                        productId: product.id,
                        transferUnit: product.selectedQuantity
                    });
                }
                else {
                  this.translate.get("transferPage.apiMessageCode.SERVER_ERROR_INTRASERVICE_REQUEST_FAILED_QANTITY_MISMATCH").subscribe(msg => {
                    const productMissingRef = this.modelService.open(ConfirmationTransferComponent, { windowClass: 'new-item-modal', centered: true, keyboard, backdrop });
                    productMissingRef.componentInstance.title = `<br/> <b>Product: ${product.id}</b>: ${msg}` ;
                    productMissingRef.componentInstance.onlyOK = true;
                    productMissingRef.result.then((userResponse) => { });
                  });
                  proceedSubmit = false;
                }
            });

          }

            // return if any max qty missing
            if(proceedSubmit == false) {
              this.spinner.hide();
              return;
            }

            let req: TransferRequest =
            {
              repTo: this.selectedSaleRep[0]?.id ?? '',
              transferType: this.selectedTransferType,
              products: transferProductRequest
            };
 
            this.transferService.submitTransfer(req).subscribe(res => {
              if (res !== "") {
                  
                this.spinner.hide();

                const genericModalRef = this.modelService.open(ConfirmationTransferComponent,{ windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
                genericModalRef.componentInstance.onlyOK = true;  
                // Display sucess message to user (e.g., using toast or modal)
                this.translate.get("transferPage.apiMessageCode.SUCCESS_TRANSFER").subscribe(msg => {
                  genericModalRef.componentInstance.title = msg;
                  genericModalRef.componentInstance.showSucessIcon = true;
                  this.spinner.hide();
                  this.resetTransfer();
                });           
              }
            },
            
            (error: any) => {
              let errorCodeTranslated = 'SERVER_ERROR_GENERIC';
              let productErrors: any[] = [];
          
              if (error && error.error && error.error.Message) {
                try {
                  const errorResponse = JSON.parse(error.error.Message);
                  if (errorResponse) {
                    const errorCode = errorResponse.apiMessageCode;
                    if (errorCode) {
                      errorCodeTranslated = errorCode;
                      // Extract product errors if available
                      productErrors = errorResponse.productWiseError || [];
                    }
                  }
                } catch (parseError) {
                  // Handle parsing error
                }
              }
          
              this.displayGenericErrorMessageNew(errorCodeTranslated, productErrors);
            }
          );

          }
        });
      });
      }
            
  displayGenericErrorMessageNew(errorCode: string, productErrors: any[]) {
    const genericModalRef = this.modelService.open(ConfirmationTransferComponent,{ windowClass: 'filter-view', centered: true, keyboard:false, backdrop: 'static' });
    genericModalRef.componentInstance.onlyOK = true;
    const errorMessageKey = `transferPage.apiMessageCode.${errorCode}`;

    let errorMessage = '';
      // Generate error message for each product error
      productErrors.forEach(error => {
        if (error.productId) {
          errorMessage += `<br/> <b>Product: ${error.productId}</b>`;
        }
        if (error.apiMessageCode) {
          const productMessageKey = `transferPage.apiMessageCode.${error.apiMessageCode}`;
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
  }
  
  
}