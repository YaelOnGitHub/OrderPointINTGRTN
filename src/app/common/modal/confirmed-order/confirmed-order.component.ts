import { Component, Input, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirmed-order',
  templateUrl: './confirmed-order.component.html',
  styleUrls: ['./confirmed-order.component.scss']
})
export class ConfirmedOrderComponent implements OnInit {
  @Input() orderNumber: any;
  constructor(public modal: NgbActiveModal, private router: Router) { }

  ngOnInit(): void {
    // console.log('ConfirmedOrderComponent');         
  }

  onCloseModal() {
    this.modal.dismiss();    
    if(this.router.url.indexOf('user') > -1){      
      if(this.router.url.indexOf('/cart') > -1){
        this.router.navigate([this.router.url.replace('cart','dashboard')]);
      }
      if(this.router.url.indexOf('/cart-convention-shipment') > -1){
        this.router.navigate([this.router.url.replace('cart-convention-shipment','dashboard')]);
      }
      if(this.router.url.indexOf('/cart-drop-shipment') > -1){
        this.router.navigate([this.router.url.replace('cart-drop-shipment','dashboard')]);
      }
    } else if(this.router.url.indexOf('manager') > -1 || this.router.url.indexOf('admin') > -1){
      if(this.router.url.indexOf('/cart') > -1){
        this.router.navigate([this.router.url.replace('/cart','')]);
      }
      if(this.router.url.indexOf('/cart-convention-shipment') > -1){
        this.router.navigate([this.router.url.replace('/cart-convention-shipment','')]);
      }
      if(this.router.url.indexOf('/cart-drop-shipment') > -1){
        this.router.navigate([this.router.url.replace('/cart-drop-shipment','')]);
      }
    }
  }
}
