import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderHistoryService } from 'src/app/shared/services/order-history.service';

@Component({
  selector: 'app-view-transfer-history-details',
  templateUrl: './transfer-history-details.component.html',
  styleUrls: ['./transfer-history-details.component.scss']
})
export class ViewTransferHistoryDetailComponent implements OnInit {
  src = ''

  @Input() transferDetails: any;
  loadingOD = false;
  public isCollapsed = false;
  constructor(public modal: NgbActiveModal, public orderHistoryService: OrderHistoryService) {

  }


  ngOnInit(): void {

  }

  onCloseModal() {
    this.modal.dismiss();
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
@Pipe({
  name: 'addressFormate'
})
export class addressFormatePipe implements PipeTransform {

  transform(value: any, args?: any): unknown {
    if (!value) {
      return null;
    }
    return value.name + ', ' + value.address1 + ', ' + value.city + ', ' + value.state + ', ' + value.country + ', ' + value.zip;
  }

}
