import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartConventionShipmentComponent } from '../common/components/all-cart-types/cart-convention-shipment/cart-convention-shipment.component';
import { CartDropShipmentComponent } from '../common/components/all-cart-types/cart-drop-shipment/cart-drop-shipment.component';
import { CartComponent } from '../common/components/all-cart-types/cart/cart.component';
import { OrderHistoriesComponent } from '../common/components/order-histories/order-histories.component';
import { ImpersonatingGuard } from '../shared/gaurd/impersonating.gaurd';
import { AdminComponent } from './admin.component';
import { ImpersonatingComponent } from './impersonating/impersonating.component';
import { UserComponent } from './user/user.component';
import { TransferHistoriesComponent } from '../common/components/transfer-histories/transfer-histories.component';
import { MyDtpLimitsComponent } from '../common/components/my-dtp-limits/my-dtp-limits.component';
import { MyTeamComponent } from '../common/components/my-team/my-team.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: UserComponent,
        data: { impersonating: false }
      },
      {
        path: 'impersonating',
        component: ImpersonatingComponent,
        data: { impersonating: true },
        canActivate: [ImpersonatingGuard]
      },
      {
        path: 'impersonating/cart',
        component: CartComponent,
        canActivate: [ImpersonatingGuard]
      },
      {
        path: 'impersonating/cart-convention-shipment',
        component: CartConventionShipmentComponent,
        canActivate: [ImpersonatingGuard]
      },
      {
        path: 'impersonating/cart-drop-shipment',
        component: CartDropShipmentComponent,
        canActivate: [ImpersonatingGuard]
      },
      {
        path: 'impersonating/order-history',
        component: OrderHistoriesComponent,
        canActivate: [ImpersonatingGuard]
      },
      {
        path: 'impersonating/transfer-history',
        component: TransferHistoriesComponent,
        canActivate: [ImpersonatingGuard]
      },
      {
        path: 'impersonating/my-dtp-limits',
        component: MyDtpLimitsComponent,
        canActivate: [ImpersonatingGuard]
      },
      {
        path: 'impersonating/my-team',
        component: MyTeamComponent,
        canActivate: [ImpersonatingGuard]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
