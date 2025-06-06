import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-confirmation-reorder',
  templateUrl: './confirmation-reorder.component.html',
  styleUrls: ['./confirmation-reorder.component.scss']
})
export class ConfirmationReOrderComponent implements OnInit {
  @Input() title: any;
  @Input() details: any;
  @Input() onlyOK = false;
  
  constructor(public modal: NgbActiveModal) { }
 
  ngOnInit(): void {
  }

  onCloseModal() {
    this.modal.dismiss();
  }
}
