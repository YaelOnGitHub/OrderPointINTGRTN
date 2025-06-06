import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NameItemFilterPipe, OrderTypeItemFilterPipe, ProductStatusFilterPipe, StatusItemFilterPipe } from '../shared/pipe/status-item-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonSharedModule } from '../common/common-shared.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UsersComponent,
    HomeComponent,
    StatusItemFilterPipe, OrderTypeItemFilterPipe, NameItemFilterPipe, ProductStatusFilterPipe
  ],
  imports: [
    NgxPaginationModule,
    CommonSharedModule,
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule
  ],

})
export class UsersModule { }
