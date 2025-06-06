import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-not-available',
  templateUrl: './product-not-available.component.html',
  styleUrls: ['./product-not-available.component.scss']
})
export class ProductNotAvailableComponent implements OnInit {

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    // console.log('ProductNotAvailableComponent');
  }

  onCloseModal() {
    this.modal.dismiss();
  }

}
