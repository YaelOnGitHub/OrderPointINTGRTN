import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-warning-addtocart',
  templateUrl: './warning-addtocart.component.html',
  styleUrls: ['./warning-addtocart.component.scss']
})
export class WarningAddToCartComponent implements OnInit {
  @Input() title: any;
  @Input() details: any;
  @Input() onlyOK = false;  
  @Input() showSucessIcon = false;
  @Input() okayButtonText= 2;
  
  constructor(public modal: NgbActiveModal) { }
 
  ngOnInit(): void {
  }

  onCloseModal() {
    this.modal.dismiss();
  }
}
