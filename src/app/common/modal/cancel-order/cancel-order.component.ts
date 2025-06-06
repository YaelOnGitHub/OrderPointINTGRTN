import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss']
})
export class CancelOrderComponent implements OnInit {
  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    // console.log('Cancel-Order');
  }

  onCloseModal() {
    this.modal.dismiss();
  }
}
