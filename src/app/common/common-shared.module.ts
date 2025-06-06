import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './modal/confirmation/confirmation.component';
import { ConfirmedOrderComponent } from './modal/confirmed-order/confirmed-order.component';
import { CancelOrderComponent } from './modal/cancel-order/cancel-order.component';
import { RemoveFromCartComponent } from './modal/remove-from-cart/remove-from-cart.component';
import { ClearCartComponent } from './modal/clear-cart/clear-cart.component';
import { addressFormatePipe, ViewOrderDetailsComponent } from './modal/view-order-details/view-order-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterOrderDetailsComponent } from './modal/filter-order-details/filter-order-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddAddressComponent } from './modal/add-address/add-address.component';
import { ProductNotAvailableComponent } from './modal/product-not-available/product-not-available.component';
import { NoShowPipe, SidebarFilterComponent } from './components/sidebar-filter/sidebar-filter.component';
import { ProductListComponent, ProductStatusFilterPipe, PeriodLabelFilterPipe } from './components/product-list/product-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderHistoriesComponent } from './components/order-histories/order-histories.component';
import { RouterModule } from '@angular/router';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { CartComponent } from './components/all-cart-types/cart/cart.component';
import { CartConventionShipmentComponent } from './components/all-cart-types/cart-convention-shipment/cart-convention-shipment.component';
import { CartDropShipmentComponent } from './components/all-cart-types/cart-drop-shipment/cart-drop-shipment.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BrowserModule } from '@angular/platform-browser';
import { ProductDetailsComponent } from './modal/product-details/product-details.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { QuantitySelectorPipe } from './pipes/quantity-selector.pipe';
import { CoreModule } from 'src/ytbe/core/core.module';
import { FormDirectiveModule } from 'src/ytbe/forms/directives/form-directives.module';
import { FormsCommonModule } from 'src/ytbe/forms/forms-common.module';
import { AgGridModule } from 'ag-grid-angular';
import { ScreenSizeDetectorComponent } from '../shared/components/screen-size-detector/screen-size-detector.component';
import { TransferHistoriesComponent } from './components/transfer-histories/transfer-histories.component';
import { ViewTransferHistoryDetailComponent } from './modal/transfer-history-details/transfer-history-details.component';
import { MyDtpLimitsComponent } from './components/my-dtp-limits/my-dtp-limits.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaxValueDirective } from 'src/app/shared/max-value.directive';
import { ConfirmationTransferComponent } from 'src/app/common/modal/confirmation-transfer/confirmation-transfer.component';
import { ConfirmationReOrderComponent } from './modal/confirmation-reorder/confirmation-reorder.component';
import { WarningAddToCartComponent } from './modal/warning-addtocart/warning-addtocart.component';
import { MyTeamComponent } from './components/my-team/my-team.component';
import { TeamMembersComponent } from './components/my-team/team-members/team-members.component';
import { TransferRepComponent } from './modal/transfer-rep/transfer-rep.component';
import { AiExpertModule } from './components/ai-expert/ai-expert.module';

@NgModule({
  declarations: [
    WarningAddToCartComponent,
    ConfirmationReOrderComponent,
    ConfirmationTransferComponent,
    ConfirmationComponent,
    ConfirmedOrderComponent,
    CancelOrderComponent,
    RemoveFromCartComponent,
    ClearCartComponent,
    ViewOrderDetailsComponent,
    ViewTransferHistoryDetailComponent,
    FilterOrderDetailsComponent,
    AddAddressComponent,
    ProductNotAvailableComponent,
    addressFormatePipe, SidebarFilterComponent,
    ProductListComponent, ProductStatusFilterPipe, PeriodLabelFilterPipe,
    OrderHistoriesComponent, TransferHistoriesComponent, MainHeaderComponent,

    ProductDetailsComponent,
    // Carts
    CartComponent,
    CartConventionShipmentComponent,
    CartDropShipmentComponent,
    QuantitySelectorPipe,
    NoShowPipe,
    ScreenSizeDetectorComponent,
    MyDtpLimitsComponent,
    MaxValueDirective,
    MyTeamComponent,
    TeamMembersComponent,
    TransferRepComponent
  ],
  imports: [
    CommonModule, NgbModule, FormsModule, NgxPaginationModule, RouterModule, TranslateModule,
    FormDirectiveModule,
    NgxDaterangepickerMd.forRoot(),
    SharedModule,ReactiveFormsModule,
    CoreModule,
    FormsCommonModule,
    FormDirectiveModule,
    AgGridModule.withComponents(),
    NgMultiSelectDropDownModule.forRoot(),
    AiExpertModule
  ],
  providers: [],
  entryComponents: [
    AddAddressComponent,
    ViewOrderDetailsComponent, ViewTransferHistoryDetailComponent, SidebarFilterComponent,TransferRepComponent,
    // Carts
    CartComponent,
    CartConventionShipmentComponent,
    CartDropShipmentComponent,
    ProductDetailsComponent,
    QuantitySelectorPipe,
    NoShowPipe,
    ScreenSizeDetectorComponent
  ],
  exports: [
    CommonModule, NgbModule, FormsModule,
    ConfirmationComponent,
    ConfirmedOrderComponent,
    CancelOrderComponent,
    RemoveFromCartComponent,
    ClearCartComponent,
    ViewOrderDetailsComponent,
    ViewTransferHistoryDetailComponent,
    FilterOrderDetailsComponent,
    AddAddressComponent,
    ProductNotAvailableComponent, addressFormatePipe, SidebarFilterComponent,
    ProductListComponent, OrderHistoriesComponent, TransferHistoriesComponent, MainHeaderComponent,
    // Carts
    CartComponent,
    CartConventionShipmentComponent,
    CartDropShipmentComponent,
    ReactiveFormsModule,
    FormsCommonModule,
    SharedModule,
    TranslateModule,
    CommonModule,
    ScreenSizeDetectorComponent,
    MyDtpLimitsComponent,
    TransferRepComponent,
    AiExpertModule
  ]
})
export class CommonSharedModule { }
