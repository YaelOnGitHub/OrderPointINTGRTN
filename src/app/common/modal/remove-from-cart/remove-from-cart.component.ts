import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-remove-from-cart',
  templateUrl: './remove-from-cart.component.html',
  styleUrls: ['./remove-from-cart.component.scss']
})
export class RemoveFromCartComponent implements OnInit {
  constructor(
    public router: Router, 
    public modal: NgbActiveModal,
    public translate: TranslateService
    ) { }

  ngOnInit(): void {
    // console.log('RemoveFromCartComponent');
  }

  onCloseModal() {
    this.modal.dismiss();
  }
 
  backToProducts() {
    this.modal.close();
    this.router.navigateByUrl(this.translate.currentLang + '/users');
  }
}
