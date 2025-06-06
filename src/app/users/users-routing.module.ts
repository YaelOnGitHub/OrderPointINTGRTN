import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartConventionShipmentComponent } from '../common/components/all-cart-types/cart-convention-shipment/cart-convention-shipment.component';
import { CartDropShipmentComponent } from '../common/components/all-cart-types/cart-drop-shipment/cart-drop-shipment.component';
import { CartComponent } from '../common/components/all-cart-types/cart/cart.component';
import { OrderHistoriesComponent } from '../common/components/order-histories/order-histories.component';

import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users.component';
import { TransferHistoriesComponent } from '../common/components/transfer-histories/transfer-histories.component';
import { MyDtpLimitsComponent } from '../common/components/my-dtp-limits/my-dtp-limits.component';
import { MyTeamComponent } from '../common/components/my-team/my-team.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'dashboard',
        component: HomeComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'cart-convention-shipment',
        component: CartConventionShipmentComponent,
      },
      {
        path: 'cart-drop-shipment',
        component: CartDropShipmentComponent,
      },
      {
        path: 'order-history',
        component: OrderHistoriesComponent,
      },
      {
        path: 'transfer-history',
        component: TransferHistoriesComponent,
      },
      {
        path: 'my-dtp-limits',
        component: MyDtpLimitsComponent,
      },
      {
        path: 'my-team',
        component: MyTeamComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full' 
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
