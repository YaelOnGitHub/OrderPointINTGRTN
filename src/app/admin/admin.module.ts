import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserComponent } from './user/user.component';
import { ImpersonatingComponent } from './impersonating/impersonating.component';
import { CommonSharedModule } from '../common/common-shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AdminComponent,
    UserComponent,
    ImpersonatingComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CommonSharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TranslateModule
  ]
})
export class AdminModule { }
