import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numericOnly]',
})
export class NumericOnlyDirective {
  constructor(private _elementRef: ElementRef) { }
  
  @HostListener('input', ['$event']) 
  onInputChange(event:any) {
    //Filter the value
    const originalValue = this._elementRef.nativeElement.value;
    this._elementRef.nativeElement.value = originalValue.replace(/[^0-9]*/g, '');
  }
}
