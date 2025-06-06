import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  @Input() titleMain: any;
  @Input() orderType: any;
  @Input() onlyOK = false;
  constructor(public modal: NgbActiveModal) { }

  title = '';
  ngOnInit(): void {
    this.title = "Your Order";
  }

  onCloseModal() {
    this.modal.dismiss();
  }
}
