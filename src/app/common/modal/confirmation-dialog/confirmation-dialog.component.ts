import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 
 

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() data: any;
  constructor(public modal: NgbActiveModal) { }
    
  ngOnInit(): void { 
    // console.log(this.data)
  }

  onCloseModal() {
    this.modal.dismiss();
  }
}
