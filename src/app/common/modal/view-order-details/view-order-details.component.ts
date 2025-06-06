import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderHistoryService } from 'src/app/shared/services/order-history.service';

@Component({
  selector: 'app-view-order-details',
  templateUrl: './view-order-details.component.html',
  styleUrls: ['./view-order-details.component.scss']
})
export class ViewOrderDetailsComponent implements OnInit {
  @Input() sectionTypeHTML: any;   // 1 = order-details  2 = Track details
  @Input() ordersID: any;
  src = ''

  ordersDetails: any;
  items: any[] = [];
  trackingDetails: any[] = [];
  // ordersID: any;
  loadingOD = false;
  public isCollapsed = false;
  anchorTemplate = "<a href='##trackingurl##' target='_blank'>##trackingnumber##</a>";
  constructor(public modal: NgbActiveModal, public orderHistoryService: OrderHistoryService) {
    // // console.log(this.ordersID);
    // this.orderHistoryService.orderIdSubject.subscribe(res => {
    //   if (res && res !== '0') {
    //     this.ordersID = res;

    //   }
    // });

  }

  getOrderDetails() {
    this.loadingOD = true;
    if (this.ordersID) {
      this.orderHistoryService.getID(this.ordersID).subscribe(res => {
        this.ordersDetails = res;
        this.items = res.items.map((el: any) => { return { ...el, collapse: true } });
        this.trackingDetails = res.trackingDetails;
        this.loadingOD = false;
      });
    }
  }

  // items = [
  //   {
  //     trackId: '#45158',
  //     collapse: true,
  //     status: 'Shipped'
  //   },
  //   {
  //     trackId: '#43289',
  //     collapse: true,
  //     status: 'Backorder'
  //   },
  //   {
  //     trackId: '#5454',
  //     collapse: true,
  //     status: 'Shipping'
  //   }
  // ]
  ngOnInit(): void {
    this.getOrderDetails();
  }

  onCloseModal() {
    this.modal.dismiss();
  }

  getTrackingLink(td:any) : any {
      let trackingNumber = this.anchorTemplate;    

      if(td.trackingNumber)
      trackingNumber =  trackingNumber.replace("##trackingnumber##", td.trackingNumber);
      if(!td.url || td.url.trim() === "")
        trackingNumber = trackingNumber.replace(" href='##trackingurl##' target='_blank'", "")      
      else
        trackingNumber = trackingNumber.replace("##trackingurl##", td.url)    

      return trackingNumber;        
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
