import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clear-cart',
  templateUrl: './clear-cart.component.html',
  styleUrls: ['./clear-cart.component.scss']
})
export class ClearCartComponent implements OnInit {
  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    // console.log('Cancel-Order');
  }

  onCloseModal() {
    this.modal.dismiss();
  }
}
