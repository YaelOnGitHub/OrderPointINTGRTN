import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transfer-rep',
  templateUrl: './transfer-rep.component.html',
  styleUrls: ['./transfer-rep.component.scss']
})
export class TransferRepComponent implements OnInit {

  @Input() transferType: string = 'Rep to Rep';
  @Input() productDetails: any;
  @Input() member: any;
  @Input() allMembers: any;
  toRep: any;
  quantity: number = 0;
  maxQuantity: number = 0;
  previousQuantity: number = 1;
  quantityError: string = '';
  
  constructor(public modal: NgbActiveModal) { }
  ngOnInit(): void {

    // this.quantity =this.member.RemainingBalance;
    this.maxQuantity = this.toRep?.RemainingBalance;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  onQuantityChange(value: any) {
    const parsed = parseInt(value, 10);
  
    if (!isNaN(parsed)) {
      if (parsed > this.maxQuantity) {
        this.quantityError = `Maximum allowed quantity is ${this.maxQuantity}.`;
        this.quantity = this.previousQuantity; // revert to previous valid value
      } else if (parsed < 1) {
        this.quantityError = 'Minimum quantity is 1.';
        this.quantity = this.previousQuantity;
      } else {
        this.quantityError = '';
        this.quantity = parsed;
        this.previousQuantity = parsed; // update previous valid
      }
    } else {
      this.quantityError = 'Please enter a valid number.';
      this.quantity = this.previousQuantity;
    }
  }

  compareReps(rep1: any, rep2: any): boolean {
    return rep1 && rep2 && rep1.TerritoryId === rep2.TerritoryId;
  }
  
  onRepChange(selectedRep: any): void {
    this.maxQuantity = selectedRep.RemainingBalance;
  }

  onCloseModal() {
    this.modal.dismiss();
  }

  onSubmit(): void {
    this.modal.close({
      toRep:this.member,
      quantity: this.quantity,
      fromRep: this.toRep,
    });
  }

}
