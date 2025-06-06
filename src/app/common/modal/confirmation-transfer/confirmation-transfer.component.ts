import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-confirmation-transfer',
  templateUrl: './confirmation-transfer.component.html',
  styleUrls: ['./confirmation-transfer.component.scss']
})
export class ConfirmationTransferComponent implements OnInit {
  @Input() title: any;
  @Input() details: any;
  @Input() onlyOK = false;  
  @Input() showSucessIcon = false;
  
  constructor(public modal: NgbActiveModal) { }
 
  ngOnInit(): void {
  }

  onCloseModal() {
    this.modal.dismiss();
  }
}
